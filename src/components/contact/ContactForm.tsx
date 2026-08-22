'use client'

import { useState, type ChangeEvent, type FormEvent } from 'react'

type FormState = {
  name: string
  email: string
  message: string
}

const EMPTY_FORM: FormState = { name: '', email: '', message: '' }

const INPUT_CLASSES =
  'w-full border-4 border-bark bg-parchment px-3 py-2 font-crt text-lg text-bark focus:bg-white focus:outline-none focus:ring-4 focus:ring-gold'

export default function ContactForm({ email }: { email: string }) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)

  function update(field: keyof FormState) {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }))
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const subject = encodeURIComponent(`Portfolio message from ${form.name}`)
    const body = encodeURIComponent(
      `${form.message}\n\nFrom: ${form.name} <${form.email}>`
    )
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`
    setForm(EMPTY_FORM)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label
          htmlFor="contact-name"
          className="mb-1 block font-pixel text-sm text-brown"
        >
          PLAYER NAME
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          required
          autoComplete="name"
          value={form.name}
          onChange={update('name')}
          placeholder="Your name"
          className={INPUT_CLASSES}
        />
      </div>

      <div>
        <label
          htmlFor="contact-email"
          className="mb-1 block font-pixel text-sm text-brown"
        >
          RETURN ADDRESS (EMAIL)
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          value={form.email}
          onChange={update('email')}
          placeholder="you@example.com"
          className={INPUT_CLASSES}
        />
      </div>

      <div>
        <label
          htmlFor="contact-message"
          className="mb-1 block font-pixel text-sm text-brown"
        >
          MESSAGE
        </label>
        <textarea
          id="contact-message"
          name="message"
          required
          rows={6}
          value={form.message}
          onChange={update('message')}
          placeholder="Type your scroll here..."
          className={`${INPUT_CLASSES} resize-y`}
        />
      </div>

      <button
        type="submit"
        className="border-4 border-bark bg-gold px-6 py-3 font-pixel text-lg text-bark shadow-pixel transition-colors hover:bg-coin focus-visible:bg-coin focus-visible:outline-none active:translate-x-[2px] active:translate-y-[2px] active:shadow-pixel-sm sm:self-start"
      >
        SEND MESSAGE
      </button>
    </form>
  )
}
