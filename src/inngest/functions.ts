import { createAgent, openai } from '@inngest/agent-kit'

import { inngest } from './client'

export const helloWorld = inngest.createFunction(
    { id: 'hello-world' },
    { event: 'test/hello.world' },
    async ({ event }) => {
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

        console.log(output)

        return { output }
    },
)
