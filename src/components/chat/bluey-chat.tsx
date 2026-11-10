import { useEffect, useRef, useState } from "react";
import { Lightbulb, ListChecks, Mail, MoreHorizontal, RotateCcw, ShieldCheck } from "lucide-react";

import blueyLogo from "@/assets/bluey-logo.png";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message";
import {
  PromptInput,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { Button } from "@/components/ui/button";

type ChatMessage = { id: string; role: "user" | "assistant"; text: string; time: string };

const SAMPLE: ChatMessage[] = [
  {
    id: "m1",
    role: "assistant",
    text: "Hi, I'm **Bluey** 👋 How can I help you today?",
    time: "9:41 AM",
  },
  {
    id: "m2",
    role: "user",
    text: "Can you help me write a short follow-up email after a client meeting?",
    time: "9:42 AM",
  },
  {
    id: "m3",
    role: "assistant",
    text: "Of course. Here's a clean draft you can adapt:\n\n**Subject:** Thank you for today's meeting\n\nHi Sarah,\n\nThank you for taking the time to meet today. I appreciated the discussion about your Q1 goals and I'm confident we can support them.\n\nAs agreed, I'll send the proposal by **Friday**. Let me know if anything comes up before then.\n\nBest regards,\nAlex",
    time: "9:42 AM",
  },
];

const SUGGESTIONS = [
  { icon: Mail, label: "Draft an email" },
  { icon: ListChecks, label: "Plan my week" },
  { icon: Lightbulb, label: "Brainstorm ideas" },
];

const PREVIEW_REPLY =
  "Thanks for your message! I'm a design preview right now, so I can't give real answers yet — but this is exactly where my reply would appear.";

function now() {
  return new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
}

function BlueyAvatar({ size = "sm" }: { size?: "sm" | "lg" }) {
  const cls = size === "lg" ? "size-14 rounded-2xl" : "size-8 rounded-xl";
  return (
    <span className={`flex shrink-0 items-center justify-center bg-card ring-1 ring-border ${cls}`}>
      <img
        src={blueyLogo}
        alt=""
        width={256}
        height={256}
        className={size === "lg" ? "size-10" : "size-6"}
      />
    </span>
  );
}

export function BlueyChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(SAMPLE);
  const [thinking, setThinking] = useState(false);
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    textareaRef.current?.focus();
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  useEffect(() => {
    if (!thinking) textareaRef.current?.focus();
  }, [thinking]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || thinking) return;
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", text: trimmed, time: now() },
    ]);
    setInput("");
    setThinking(true);
    timer.current = setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", text: PREVIEW_REPLY, time: now() },
      ]);
      setThinking(false);
    }, 1400);
  };

  const handleSubmit = (msg: PromptInputMessage) => send(msg.text ?? "");

  const reset = () => {
    if (timer.current) clearTimeout(timer.current);
    setThinking(false);
    setMessages([]);
    setInput("");
    textareaRef.current?.focus();
  };

  const isEmpty = messages.length === 0 && !thinking;

  return (
    <section className="flex h-full w-full flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-panel">
      {/* Header */}
      <header className="bg-header flex items-center gap-3 px-5 py-4 text-primary-foreground">
        <span className="flex size-11 items-center justify-center rounded-2xl bg-card">
          <img src={blueyLogo} alt="Bluey logo" width={256} height={256} className="size-8" />
        </span>
        <div className="min-w-0 flex-1">
          <h1 className="font-display text-lg font-semibold leading-tight">Bluey</h1>
          <p className="flex items-center gap-2 text-xs text-primary-foreground/80">
            <span className="status-pulse size-2 shrink-0 rounded-full bg-brand-accent" />
            <span>
              Online<span className="hidden sm:inline"> · Typically replies instantly</span>
            </span>
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={reset}
          className="text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground"
        >
          <RotateCcw className="size-4" />
          <span className="hidden sm:inline">New chat</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="More options"
          title="More options"
          className="text-primary-foreground hover:bg-primary-foreground/15 hover:text-primary-foreground"
        >
          <MoreHorizontal className="size-5" />
        </Button>
      </header>

      {/* Transcript */}
      <Conversation className="bg-background/60">
        <ConversationContent className="mx-auto w-full max-w-3xl gap-6 px-5 py-6">
          {isEmpty ? (
            <div className="message-in flex flex-col items-center gap-4 py-16 text-center">
              <BlueyAvatar size="lg" />
              <div className="space-y-1">
                <h2 className="font-display text-2xl font-semibold">How can I help today?</h2>
                <p className="text-sm text-muted-foreground">
                  Ask Bluey anything, or start with one of these.
                </p>
              </div>
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map(({ icon: Icon, label }) => (
                  <Button key={label} variant="chip" size="sm" onClick={() => send(label)}>
                    <Icon className="size-4 text-brand-accent-ink" />
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                Today
                <span className="h-px flex-1 bg-border" />
              </div>
              {messages.map((m) => (
                <Message key={m.id} from={m.role} className="message-in max-w-full">
                  {m.role === "assistant" ? (
                    <div className="flex items-start gap-3">
                      <BlueyAvatar />
                      <div className="min-w-0 flex-1 space-y-1 pt-1">
                        <MessageContent className="text-[0.938rem] leading-relaxed">
                          <MessageResponse className="chat-prose">{m.text}</MessageResponse>
                        </MessageContent>
                        <p className="text-[0.7rem] text-muted-foreground">Bluey · {m.time}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="ml-auto flex max-w-[80%] flex-col items-end gap-1">
                      <MessageContent className="rounded-2xl rounded-br-md bg-primary px-4 py-3 text-[0.938rem] leading-relaxed text-primary-foreground shadow-user group-[.is-user]:bg-primary group-[.is-user]:text-primary-foreground group-[.is-user]:rounded-2xl group-[.is-user]:rounded-br-md">
                        {m.text}
                      </MessageContent>
                      <p className="text-[0.7rem] text-muted-foreground">You · {m.time}</p>
                    </div>
                  )}
                </Message>
              ))}
              {thinking && (
                <Message from="assistant" className="message-in">
                  <div className="flex items-center gap-3">
                    <BlueyAvatar />
                    <Shimmer className="text-sm">Bluey is thinking…</Shimmer>
                  </div>
                </Message>
              )}
            </>
          )}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      {/* Composer */}
      <div className="border-t border-border bg-card px-5 pb-4 pt-3">
        <div className="mx-auto w-full max-w-3xl">
          <PromptInput
            onSubmit={handleSubmit}
            className="rounded-2xl bg-background shadow-none [&_[data-slot=input-group]]:rounded-2xl"
          >
            <PromptInputTextarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.currentTarget.value)}
              placeholder="Message Bluey…"
              className="min-h-12 px-4 text-[0.938rem]"
            />
            <PromptInputFooter className="justify-end px-3 pb-2 sm:justify-between">
              <span className="hidden items-center gap-1.5 text-xs text-muted-foreground sm:flex">
                <ShieldCheck className="size-3.5" />
                Press Enter to send, Shift + Enter for a new line
              </span>
              <PromptInputSubmit
                variant="accent"
                className="rounded-xl"
                status={thinking ? "submitted" : "ready"}
                disabled={thinking || !input.trim()}
              />
            </PromptInputFooter>
          </PromptInput>
        </div>
      </div>
    </section>
  );
}
