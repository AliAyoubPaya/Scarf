import { Plus } from "lucide-react";
import { SiteContainer } from "@/components/local/site-container";

const questions = [
  { question: "Can you help me choose a fabric or shade?", answer: "Absolutely. Tell us how you like to style your hijab, the occasion and the colours you have in mind. Sharing the name of a scarf you’re considering helps us understand the look you love." },
  { question: "What should I include in an order enquiry?", answer: "Please include your order number and a short description of what you need help with. Never share your password, full card number or payment security code." },
  { question: "How can I ask about a return or exchange?", answer: "Choose “Returns & exchanges” in your message and include the order number, item name and the reason for your request. Our team can help you check the available options for your order." },
  { question: "Where can I ask about delivery?", answer: "Message our team with your city and the item you’re interested in. If you have already placed an order, include your order number so we can help with your delivery enquiry." },
  { question: "Can I get in touch about a collaboration?", answer: "We’d love to hear your idea. Choose “Collaboration” and tell us about yourself, your social profile and what you have in mind." },
];

export function ContactFaq() {
  return (
    <section aria-labelledby="contact-faq-title" className="border-t border-[#e7e0d4] bg-[#f4f0e9] py-14 sm:py-20">
      <SiteContainer className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-brand-gold-ink">A few helpful answers</p>
          <h2 id="contact-faq-title" className="mt-4 text-3xl font-light leading-tight tracking-[-0.025em] sm:text-4xl">Before you say hello.</h2>
          <p className="mt-4 max-w-sm text-sm leading-7 text-[#71695d]">A little guidance to make getting the help you need easier.</p>
          <a href="#contact-message" className="mt-4 inline-flex min-h-11 items-center text-sm text-brand-gold-ink underline underline-offset-4">Still have a question? Let’s talk.</a>
        </div>
        <div className="divide-y divide-[#dcd4c6] border-y border-[#dcd4c6] [&_summary]:flex [&_summary]:min-h-18 [&_summary]:cursor-pointer [&_summary]:list-none [&_summary]:items-center [&_summary]:justify-between [&_summary]:gap-5 [&_summary]:py-5 [&_summary]:font-heading [&_summary]:text-base [&_summary]:font-normal [&_summary]:focus-visible:outline-2 [&_summary]:focus-visible:outline-offset-4 [&_summary]:focus-visible:outline-brand-gold-ink [&_summary::-webkit-details-marker]:hidden">
          {questions.map(({ question, answer }) => (
            <details key={question} className="group">
              <summary>{question}<Plus aria-hidden="true" className="size-4 shrink-0 text-brand-gold-ink transition-transform group-open:rotate-45 motion-reduce:transition-none" strokeWidth={1.5} /></summary>
              <p className="pb-6 pr-6 text-sm leading-7 text-[#71695d]">{answer}</p>
            </details>
          ))}
        </div>
      </SiteContainer>
    </section>
  );
}
