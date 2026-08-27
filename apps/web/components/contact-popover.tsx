"use client";

import { useState } from "react";

const CONTACT_IMAGE =
  "https://jiahim-picgo.oss-cn-shenzhen.aliyuncs.com/img/xhs.jpg";

export function ContactPopover() {
  const [open, setOpen] = useState(false);
  const [pinned, setPinned] = useState(false);

  return (
    <div
      className="contact-popover"
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setOpen(false);
          setPinned(false);
        }
      }}
      onFocus={() => setOpen(true)}
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch") setOpen(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "touch" && !pinned) setOpen(false);
      }}
    >
      <button
        aria-controls="contact-qr-popover"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label="查看 JiaHim 的小红书二维码"
        className={open ? "contact-trigger active" : "contact-trigger"}
        onClick={() => {
          setPinned((current) => {
            const next = !current;
            setOpen(next);
            return next;
          });
        }}
        type="button"
      >
        <span aria-hidden="true" />
        找到我
      </button>
      <div
        aria-hidden={!open}
        aria-label="JiaHim 的小红书二维码"
        className={open ? "contact-card open" : "contact-card"}
        id="contact-qr-popover"
        role="dialog"
      >
        <div>
          {open && (
            // The owner asked to keep using the reference site's remote image.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              alt="JiaHim（科技版）的小红书二维码，小红书号 sam12138"
              draggable={false}
              height="1347"
              src={CONTACT_IMAGE}
              width="987"
            />
          )}
        </div>
      </div>
    </div>
  );
}
