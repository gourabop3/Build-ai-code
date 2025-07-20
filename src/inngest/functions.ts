import { Sandbox } from '@e2b/code-interpreter'
import { createAgent, openai } from '@inngest/agent-kit'

import { inngest } from './client'
import { getSandbox } from './utils'

export const helloWorld = inngest.createFunction(
    { id: 'hello-world' },
    { event: 'test/hello.world' },
    async ({ event, step }) => {
        const sandboxId = await step.run('get-sandbox-id', async () => {
            const sandbox = await Sandbox.create('nextjs-template-test')
            return sandbox.sandboxId
        })

        const codeAgent = createAgent({
            name: 'code-agent',
            system: 'You are an expert next.js developer. You write readable, maintainable code. You write simple Next.js & React snippets.',
            model: openai({
                baseUrl: process.env.OPENROUTER_BASE_URL,
                apiKey: process.env.OPENROUTER_API_KEY,
                model: 'deepseek/deepseek-r1-0528-qwen3-8b:free',
            }),
        })

        const { output } = await codeAgent.run(
            `Write the following snippet: ${event.data.value}`,
        )

        const sandboxUrl = await step.run('get-sandbox-url', async () => {
            const sandbox = await getSandbox(sandboxId)
            const host = sandbox.getHost(3000) // this is the port that the sandbox is running on
            return `https://${host}`
        })

        console.log(output)

        return { output, sandboxUrl }
    },
)
