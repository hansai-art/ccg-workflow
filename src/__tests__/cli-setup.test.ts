import { describe, expect, it } from 'vitest'
import { customizeHelp } from '../cli-setup'
import { initI18n } from '../i18n'

describe('customizeHelp', () => {
  it('localizes built-in CAC help sections in Traditional Chinese', async () => {
    await initI18n('zh-TW')

    const sections = customizeHelp([
      { body: 'ccg/2.1.11' },
      { title: 'Usage', body: '  $ ccg init' },
      { title: 'Commands', body: '  init  Initialize CCG multi-model collaboration system' },
      { title: 'For more info, run any command with the `--help` flag', body: '  $ ccg init --help' },
      { title: 'Options', body: '  -h, --help  Display this message\n  -v, --version  Display version number\n  --mode <mode>  Mode (default: smart)' },
    ])

    expect(sections.some(section => section.title === '用法')).toBe(true)
    expect(sections.some(section => section.title === '命令')).toBe(true)
    expect(sections.some(section => section.title === '更多資訊')).toBe(true)
    expect(sections.some(section => section.title === '選項')).toBe(true)

    const optionsSection = sections.find(section => section.title === '選項')
    expect(optionsSection?.body).toContain('顯示幫助資訊')
    expect(optionsSection?.body).toContain('顯示版本號')
    expect(optionsSection?.body).toContain('(預設: smart)')
  })

  it('keeps English help output localized for English users', async () => {
    await initI18n('en')

    const sections = customizeHelp([
      { body: 'ccg/2.1.11' },
      { title: 'Usage', body: '  $ ccg init' },
      { title: 'Options', body: '  -h, --help  Display this message\n  -v, --version  Display version number' },
    ])

    expect(sections.some(section => section.title === 'Usage')).toBe(true)
    const optionsSection = sections.find(section => section.title === 'Options')
    expect(optionsSection?.body).toContain('Display help')
    expect(optionsSection?.body).toContain('Display version')
  })
})
