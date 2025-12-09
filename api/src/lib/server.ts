import { rm } from "node:fs/promises"
import * as os from "node:os"
import type { ContainerStats } from "dockerode"
import docker from "$lib/services/docker"
import { network } from "../index"

const TOTAL_CORES = os.cpus().length

export async function createServer(options: { name: string; port: number }) {
  const IMAGE = "itzg/minecraft-server" as const

  await docker.pull(IMAGE)

  const container = await docker.createContainer({
    Image: IMAGE,
    name: `mc-${options.name}`,
    Env: [
      "EULA=TRUE",
      `SERVER_NAME=${options.name}`,
      `RCON_PASSWORD=password`,
      "VERSION=1.20.1"
    ],
    ExposedPorts: {
      "25565/tcp": {}
    },
    NetworkingConfig: {
      EndpointsConfig: {
        [network]: {}
      }
    },
    HostConfig: {
      PortBindings: {
        "25565/tcp": [{ HostPort: options.port.toString() }]
      },
      RestartPolicy: { Name: "unless-stopped" },
      Binds: [`/data/mc/${options.name}:/data`]
    }
  })

  await container.start()

  return container
}

export function getServer(containerId: string) {
  const container = docker.getContainer(containerId)
  return container.inspect()
}

export type ServerStats = {
  cpu: {
    percent: {
      raw: number
      normalized: number
    }
    cores: number
  }
  memory: {
    bytes: number
    percent: number
  }
}

export async function getServerStats(
  containerId: string
): Promise<ServerStats> {
  const container = docker.getContainer(containerId)
  const stats = await container.stats({
    stream: false
  })

  const cpuPercent = getCPUUsage(stats)

  return {
    cpu: {
      percent: {
        raw: cpuPercent,
        normalized: cpuPercent / TOTAL_CORES
      },
      cores: cpuPercent / 100
    },
    memory: getMemoryUsage(stats)
  }
}

function getCPUUsage(stats: ContainerStats) {
  const cpuDelta =
    stats.cpu_stats.cpu_usage.total_usage -
    stats.precpu_stats.cpu_usage.total_usage

  const systemDelta =
    stats.cpu_stats.system_cpu_usage - stats.precpu_stats.system_cpu_usage

  const cpuCount =
    stats.cpu_stats.online_cpus || stats.cpu_stats.cpu_usage.percpu_usage.length

  if (systemDelta > 0 && cpuDelta > 0) {
    return (cpuDelta / systemDelta) * cpuCount * 100
  }

  return 0
}

function getMemoryUsage(stats: ContainerStats) {
  const usage = stats.memory_stats.usage
  const limit = stats.memory_stats.limit

  return {
    bytes: usage,
    percent: (usage / limit) * 100
  }
}

export async function deleteServer(containerId: string) {
  const container = docker.getContainer(containerId)
  const info = await container.inspect()

  await container.stop()
  await container.remove()

  await rm(`/data/${info.Name.replace("mc-", "")}`, {
    recursive: true,
    force: true
  })
}
