import React from "react";
import { cn } from "../../../lib/utils";

/**
 * Skiper 40 Animated Link — React
 * Inspired by and adapted from https://cursor.com/?from=home via Skiper UI (@skiper-ui/skiper40)
 */

export const Link000 = ({
  children,
  href = "#",
  className,
  onClick,
  ...props
}) => {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        "group relative inline-flex items-center cursor-pointer transition-colors",
        className,
        "before:pointer-events-none before:absolute before:bottom-0 before:left-0 before:h-[0.05em] before:w-full before:bg-current before:content-['']",
        "before:origin-right before:scale-x-0 before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)]",
        "hover:before:origin-left hover:before:scale-x-100"
      )}
      {...props}
    >
      {children}
    </a>
  );
};

export const Link001 = ({
  children,
  href = "#",
  className,
  target = "_blank",
  onClick,
  ...props
}) => {
  return (
    <a
      href={href}
      target={target}
      onClick={onClick}
      className={cn(
        "group relative inline-flex items-center cursor-pointer transition-colors",
        "before:pointer-events-none before:absolute before:left-0 before:bottom-0 before:h-[0.05em] before:w-full before:bg-current before:content-['']",
        "before:origin-right before:scale-x-0 before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)]",
        "hover:before:origin-left hover:before:scale-x-100",
        className
      )}
      {...props}
    >
      {children}
      <svg
        className="ml-[0.35em] size-[0.65em] translate-y-0.5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 shrink-0"
        fill="none"
        viewBox="0 0 10 10"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
};

export const Link002 = ({
  children,
  href = "#",
  className,
  onClick,
  ...props
}) => {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        "group relative inline-flex items-center cursor-pointer transition-colors",
        className,
        "before:pointer-events-none before:absolute before:left-0 before:bottom-0 before:h-[0.05em] before:w-full before:bg-current before:content-['']",
        "before:origin-right before:scale-x-0 before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)]",
        "before:origin-left",
        "hover:before:origin-right hover:before:scale-x-100"
      )}
      {...props}
    >
      {children}
      <svg
        className="ml-[0.35em] size-[0.65em] translate-y-0.5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 shrink-0"
        fill="none"
        viewBox="0 0 10 10"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
};

export const Link003 = ({
  children,
  href = "#",
  className,
  onClick,
  ...props
}) => {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        "group relative inline-flex items-center cursor-pointer transition-colors",
        className,
        "before:pointer-events-none before:absolute before:left-0 before:bottom-0 before:h-[0.05em] before:w-full before:bg-current before:content-['']",
        "before:origin-right before:scale-x-0 before:transition-transform before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)]",
        "before:origin-center",
        "hover:before:scale-x-100"
      )}
      {...props}
    >
      {children}
      <svg
        className="ml-[0.35em] size-[0.65em] translate-y-0.5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 shrink-0"
        fill="none"
        viewBox="0 0 10 10"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
};

export const Link004 = ({
  children,
  href = "#",
  className,
  onClick,
  ...props
}) => {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        "group relative inline-flex items-center cursor-pointer px-2 py-0.5 rounded transition-colors",
        className,
        "before:pointer-events-none before:absolute before:left-0 before:w-full before:bg-white before:content-['']",
        "before:origin-right before:scale-x-0 before:transition-all before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)]",
        "before:origin-center before:bottom-0",
        "before:z-0 before:h-0 before:scale-x-100 before:mix-blend-difference hover:before:h-full before:rounded"
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <svg
        className="relative z-10 ml-[0.4em] size-[0.65em] translate-y-0.5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:rotate-45 group-hover:opacity-100 shrink-0"
        fill="none"
        viewBox="0 0 10 10"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
};

export const Link005 = ({
  children,
  href = "#",
  className,
  onClick,
  ...props
}) => {
  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        "group relative inline-flex items-center cursor-pointer px-2 py-0.5 rounded transition-colors",
        className,
        "before:pointer-events-none before:absolute before:left-0 before:w-full before:bg-white before:content-['']",
        "before:scale-x-1 before:transition-all before:duration-300 before:ease-[cubic-bezier(0.4,0,0.2,1)]",
        "before:origin-left before:top-0",
        "before:z-0 before:h-full before:scale-x-0 before:mix-blend-difference hover:before:scale-x-100 before:rounded"
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>
      <svg
        className="relative z-10 ml-[0.4em] size-[0.65em] -translate-x-0.5 rotate-45 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 shrink-0"
        fill="none"
        viewBox="0 0 10 10"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          d="M1.004 9.166 9.337.833m0 0v8.333m0-8.333H1.004"
          stroke="currentColor"
          strokeWidth="1.25"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
};

export const Skiper40 = () => {
  return (
    <section className="p-6 rounded-2xl bg-surface-1 border border-white/[0.08] space-y-4">
      <div className="flex items-center justify-between border-b border-white/[0.06] pb-2">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
          Skiper UI • Skiper40 Interactive CSS Links
        </h4>
        <span className="badge-teal text-[10px] font-mono font-bold">CSS-Only Animations</span>
      </div>
      <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-200">
        <Link000 href="#">000: Underline Left-to-Right</Link000>
        <Link001 href="#">001: Arrow Reveal</Link001>
        <Link002 href="#">002: Reversing Underline</Link002>
        <Link003 href="#">003: Center-Out Expansion</Link003>
        <Link004 href="#">004: Blend Mode Sweep</Link004>
        <Link005 href="#">005: Kinetic Fill</Link005>
      </div>
    </section>
  );
};

export default Skiper40;
