import { rm } from "node:fs/promises"
import docker from "$lib/services/docker"
import { network } from "../index"

export async function createServer(options: { name: string; port: number }) {
  const container = await docker.createContainer({
    Image: "itzg/minecraft-server",
    name: `mc-${options.name}`,
    Env: ["EULA=TRUE", `SERVER_NAME=${options.name}`, `RCON_PASSWORD=password`],
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

export async function deleteServer(containerId: string) {
  const container = docker.getContainer(containerId)
  const info = await container.inspect()

  await container.stop()
  await container.remove()

  await rm(`/data/mc/${info.Name}`, { recursive: true, force: true })
}
