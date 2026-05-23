import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'

const API_BASE = 'https://api.pianyitu.com'
const CONSOLE_URL = 'https://api.pianyitu.com/login'

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    })
  }, [text])

  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 p-1.5 rounded-md bg-white/10 hover:bg-white/20 text-gray-400 hover:text-gray-200 transition-colors"
      title="复制"
    >
      {copied ? (
        <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  )
}

function CodeBlock({ children }: { children: string }) {
  return (
    <div className="relative group">
      <pre className="overflow-x-auto rounded-xl bg-[#1e1e2e] p-4 text-sm text-gray-200 leading-relaxed border border-white/5">
        <code>{children}</code>
      </pre>
      <CopyButton text={children} />
    </div>
  )
}

function MethodBadge({ method }: { method: 'GET' | 'POST' }) {
  const colors = method === 'GET'
    ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400'
    : 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400'
  return (
    <span className={`inline-block px-2 py-0.5 rounded-md text-xs font-bold font-mono ${colors}`}>
      {method}
    </span>
  )
}

function ApiSection({ method, path, desc, children }: {
  method: 'GET' | 'POST'
  path: string
  desc: string
  children: React.ReactNode
}) {
  return (
    <section className="rounded-2xl border border-gray-200 dark:border-white/[0.08] overflow-hidden">
      <div className="px-5 py-4 bg-gray-50/80 dark:bg-white/[0.02] border-b border-gray-200 dark:border-white/[0.06]">
        <div className="flex items-center gap-2.5 flex-wrap">
          <MethodBadge method={method} />
          <code className="text-sm font-semibold text-gray-800 dark:text-gray-100">{path}</code>
        </div>
        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">{desc}</p>
      </div>
      <div className="px-5 py-5 space-y-4">
        {children}
      </div>
    </section>
  )
}

function ParamTable({ rows }: { rows: [string, string][] }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-white/[0.06]">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gray-50/80 dark:bg-white/[0.02]">
            <th className="text-left py-2.5 px-4 text-gray-500 dark:text-gray-400 font-medium text-xs uppercase tracking-wider">参数</th>
            <th className="text-left py-2.5 px-4 text-gray-500 dark:text-gray-400 font-medium text-xs uppercase tracking-wider">说明</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 dark:divide-white/[0.04]">
          {rows.map(([field, desc]) => (
            <tr key={field}>
              <td className="py-2.5 px-4 font-mono text-sm text-blue-600 dark:text-blue-400 whitespace-nowrap">{field}</td>
              <td className="py-2.5 px-4 text-gray-600 dark:text-gray-300">{desc}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-950/80 backdrop-blur border-b border-gray-200 dark:border-white/[0.08]">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-14">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-1.5">
              <img src="/pwa-icon.png" alt="便宜图" className="w-7 h-7 rounded-md" />
              <span className="text-[17px] sm:text-lg font-bold tracking-tight text-gray-800 dark:text-gray-100">便宜图</span>
            </Link>
            <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-white/[0.06] px-2 py-0.5 rounded-md">API 文档</span>
          </div>
          <div className="flex items-center gap-1">
            <a
              href={CONSOLE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
            >
              控制台
            </a>
            <Link
              to="/"
              className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-900 rounded-lg transition-colors"
            >
              返回生图
            </Link>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-10 sm:py-14 space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">API 文档</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm sm:text-base">
            所有接口兼容 OpenAI 格式，基础地址为{' '}
            <code className="rounded-md bg-gray-100 dark:bg-white/10 px-2 py-0.5 font-mono text-sm text-gray-700 dark:text-gray-300">
              {API_BASE}/v1
            </code>
          </p>
        </div>

        <section className="rounded-2xl border border-gray-200 dark:border-white/[0.08] px-5 py-5 space-y-3">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">认证</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">所有请求需要在 Header 中携带 API Key：</p>
          <CodeBlock>{`Authorization: Bearer <your-api-key>`}</CodeBlock>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            前往{' '}
            <a href={CONSOLE_URL} className="text-blue-500 hover:underline" target="_blank" rel="noopener noreferrer">
              控制台
            </a>
            {' '}获取 API Key。
          </p>
        </section>

        <ApiSection method="GET" path="/v1/models" desc="返回当前可用的模型列表。">
          <CodeBlock>{`curl ${API_BASE}/v1/models \\
  -H "Authorization: Bearer <your-api-key>"`}</CodeBlock>
        </ApiSection>

        <ApiSection method="POST" path="/v1/images/generations" desc="文生图接口，根据提示词生成图片。">
          <CodeBlock>{`curl ${API_BASE}/v1/images/generations \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <your-api-key>" \\
  -d '{
    "model": "gpt-image-2",
    "prompt": "一只漂浮在太空里的猫",
    "n": 1,
    "response_format": "b64_json"
  }'`}</CodeBlock>
          <ParamTable rows={[
            ['model', '图片模型，推荐使用 gpt-image-2'],
            ['prompt', '图片生成提示词'],
            ['n', '生成数量（1-4）'],
            ['response_format', '响应格式，默认 b64_json'],
          ]} />
        </ApiSection>

        <ApiSection method="POST" path="/v1/images/edits" desc="图片编辑接口，上传参考图并根据提示词生成编辑结果。">
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">通过 multipart/form-data 上传：</p>
            <CodeBlock>{`curl ${API_BASE}/v1/images/edits \\
  -H "Authorization: Bearer <your-api-key>" \\
  -F "model=gpt-image-2" \\
  -F "prompt=把这张图改成赛博朋克风格" \\
  -F "n=1" \\
  -F "image=@./input.png"`}</CodeBlock>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">通过 JSON 传入图片 URL：</p>
            <CodeBlock>{`curl ${API_BASE}/v1/images/edits \\
  -H "Authorization: Bearer <your-api-key>" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "gpt-image-2",
    "prompt": "把这张图改成赛博朋克风格",
    "images": [
      {"image_url": "https://example.com/input.png"}
    ]
  }'`}</CodeBlock>
          </div>
          <ParamTable rows={[
            ['model', '图片模型，gpt-image-2'],
            ['prompt', '图片编辑提示词'],
            ['n', '生成数量（1-4）'],
            ['image', 'multipart/form-data 上传的图片文件'],
            ['images', 'JSON 图片引用数组，支持 {"image_url": "https://..."}'],
            ['image_url', '表单模式下也可直接传图片链接，支持重复字段传多张图'],
          ]} />
        </ApiSection>

        <ApiSection method="POST" path="/v1/chat/completions" desc="面向图片场景的 Chat Completions 兼容接口。">
          <CodeBlock>{`curl ${API_BASE}/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <your-api-key>" \\
  -d '{
    "model": "gpt-image-2",
    "messages": [
      {
        "role": "user",
        "content": "生成一张雨夜东京街头的赛博朋克猫"
      }
    ],
    "n": 1
  }'`}</CodeBlock>
          <ParamTable rows={[
            ['model', '图片模型'],
            ['messages', '消息数组'],
            ['n', '生成数量'],
            ['stream', '是否流式输出'],
          ]} />
        </ApiSection>

        <ApiSection method="POST" path="/v1/responses" desc="Responses API 兼容接口，面向图片生成工具调用。">
          <CodeBlock>{`curl ${API_BASE}/v1/responses \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer <your-api-key>" \\
  -d '{
    "model": "gpt-5",
    "input": "生成一张未来感城市天际线图片",
    "tools": [
      {
        "type": "image_generation"
      }
    ]
  }'`}</CodeBlock>
          <ParamTable rows={[
            ['model', '模型名称'],
            ['input', '输入内容（包含图片生成提示词）'],
            ['tools', '必须包含 image_generation 工具'],
            ['stream', '是否流式输出'],
          ]} />
        </ApiSection>

        <div className="text-center pt-4 pb-2">
          <Link to="/" className="text-sm text-blue-500 hover:underline">返回首页</Link>
        </div>
      </div>
    </div>
  )
}
