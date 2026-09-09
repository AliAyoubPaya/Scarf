"use client";

import { useState, type FormEvent } from "react";
import { ArrowUpRight, Check, Copy, Mail, LoaderCircle } from "lucide-react";

import { footerSocials } from "@/lib/footer";

type Feedback = { kind: "info" | "error"; message: string } | null;

export function ContactForm({ email }: { email: string | null }) {
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const [manualDraft, setManualDraft] = useState("");

  async function prepareMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const topic = String(data.get("topic") ?? "General enquiry");
    const order = String(data.get("order") ?? "").trim();
    const replyEmail = String(data.get("email") ?? "").trim();

    if (!name || message.length < 10) {
      setFeedback({ kind: "error", message: !name ? "Please enter your name." : "Please add a little more detail (at least 10 characters)." });
      (form.elements.namedItem(!name ? "name" : "message") as HTMLElement)?.focus();
      return;
    }

    const draft = [`Hello HS by Saman,`, ``, `Name: ${name}`, `Topic: ${topic}`, ...(replyEmail ? [`Reply email: ${replyEmail}`] : []), ...(order ? [`Order number: ${order}`] : []), ``, message].join("\n");

    if (email) {
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(`HS by Saman — ${topic}`)}&body=${encodeURIComponent(draft)}`;
      setFeedback({ kind: "info", message: "Your email app will open with this draft. Review it and press Send there. If it doesn’t open, copy the draft below and contact us on Instagram." });
      setManualDraft(draft);
      return;
    }

    setBusy(true);
    try {
      await navigator.clipboard.writeText(draft);
      setFeedback({ kind: "info", message: "Copied! Open Instagram below and paste your message into a DM to @hsbysaman. Your message has not been sent yet." });
    } catch {
      setManualDraft(draft);
      setFeedback({ kind: "error", message: "Automatic copying isn’t available in this browser. Select and copy your draft below, then paste it into an Instagram message." });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-w-0 rounded-2xl border border-[#e7e0d4] bg-white p-5 sm:p-8 lg:p-10 [&_input]:scroll-mt-40 [&_select]:scroll-mt-40 [&_textarea]:scroll-mt-40">
      <h3 className="text-2xl font-normal">What’s on your mind?</h3>
      <p id="contact-delivery-note" className="mt-2 text-sm leading-relaxed text-[#71695d]">
        {email ? "Prepare a note below, then send it from your email app." : "Write your note, copy it, and send it to us on Instagram. Direct website messaging isn’t available yet."}
      </p>
      <form onSubmit={prepareMessage} onChange={() => { setFeedback(null); setManualDraft(""); }} aria-describedby="contact-delivery-note" className="mt-7 space-y-5 [&_label]:mb-2 [&_label]:block [&_label]:font-heading [&_label]:text-xs [&_label]:font-medium [&_label]:tracking-wide [&_input]:min-h-12 [&_input]:w-full [&_input]:min-w-0 [&_input]:rounded-md [&_input]:border [&_input]:border-[#dcd5c9] [&_input]:bg-[#fdfcf9] [&_input]:px-3.5 [&_input]:text-base [&_input]:outline-none [&_input:focus]:border-brand-gold-ink [&_input:focus]:ring-1 [&_input:focus]:ring-brand-gold-ink [&_textarea]:w-full [&_textarea]:rounded-md [&_textarea]:border [&_textarea]:border-[#dcd5c9] [&_textarea]:bg-[#fdfcf9] [&_textarea]:p-3.5 [&_textarea]:text-base [&_textarea]:outline-none [&_textarea:focus]:border-brand-gold-ink [&_textarea:focus]:ring-1 [&_textarea:focus]:ring-brand-gold-ink">
        <p className="text-xs text-[#71695d]">Fields marked * are required.</p>
        <div className={email ? "grid gap-5 sm:grid-cols-2" : ""}>
          <div><label htmlFor="contact-name">Your name *</label><input id="contact-name" name="name" autoComplete="name" placeholder="Full name" required maxLength={100} /></div>
          {email ? <div><label htmlFor="contact-email">Your email *</label><input id="contact-email" name="email" type="email" autoComplete="email" placeholder="you@example.com" required maxLength={200} /></div> : null}
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-topic">How can we help? *</label>
            <select id="contact-topic" name="topic" defaultValue="" required className="min-h-12 w-full min-w-0 rounded-md border border-[#dcd5c9] bg-[#fdfcf9] px-3 text-base outline-none focus:border-brand-gold-ink focus:ring-1 focus:ring-brand-gold-ink">
              <option value="" disabled>Select a topic</option><option>Order enquiry</option><option>Fabric & styling advice</option><option>Returns & exchanges</option><option>Collaboration</option><option>Something else</option>
            </select>
          </div>
          <div><label htmlFor="contact-order">Order number <span className="font-normal text-[#71695d]">(optional)</span></label><input id="contact-order" name="order" placeholder="e.g. HS1234" maxLength={60} /></div>
        </div>
        <div><label htmlFor="contact-message-input">Your message *</label><textarea id="contact-message-input" name="message" placeholder="Tell us a little more. We’re listening…" rows={5} minLength={10} maxLength={2000} required aria-describedby="contact-message-hint" className="min-h-36 resize-y" /><p id="contact-message-hint" className="mt-1 text-xs leading-relaxed text-[#71695d]">10–2,000 characters. Please leave out sensitive payment details.</p></div>
        <button disabled={busy} type="submit" className="flex min-h-13 w-full items-center justify-center gap-3 rounded-md bg-brand-gold-ink px-4 font-heading text-sm font-medium text-white transition-colors hover:bg-[#604c22] disabled:cursor-wait disabled:opacity-60">
          {busy ? <LoaderCircle aria-hidden="true" className="size-4 animate-spin motion-reduce:animate-none" /> : email ? <Mail aria-hidden="true" className="size-4" /> : <Copy aria-hidden="true" className="size-4" />}
          {busy ? "Copying…" : email ? "Continue in email app" : "Copy message for Instagram"}
        </button>
        <div role="status" aria-live="polite" aria-atomic="true">
          {feedback ? <p className={`flex gap-2 rounded-md p-3 text-sm leading-relaxed ${feedback.kind === "error" ? "bg-[#fff3ef] text-[#8a3527]" : "bg-brand-gold-soft text-brand-gold-ink"}`}>{feedback.kind === "info" ? <Check aria-hidden="true" className="mt-0.5 size-4 shrink-0" /> : null}{feedback.message}</p> : null}
        </div>
        {manualDraft ? <div><label htmlFor="contact-draft">Your draft — select and copy</label><textarea id="contact-draft" readOnly value={manualDraft} rows={6} onFocus={(event) => event.currentTarget.select()} /></div> : null}
        <a href={footerSocials.instagram} target="_blank" rel="noreferrer" className="flex min-h-11 items-center justify-center gap-2 font-heading text-sm text-brand-gold-ink underline decoration-brand-gold-line underline-offset-4 hover:decoration-current">{feedback ? "Open Instagram to send your message" : "Or message us directly on Instagram"}<ArrowUpRight aria-hidden="true" className="size-4 shrink-0" /><span className="sr-only">(opens in a new tab)</span></a>
      </form>
    </div>
  );
}
