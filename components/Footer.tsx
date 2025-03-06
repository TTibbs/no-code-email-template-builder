import Link from "next/link";
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-zinc-100 py-8 border-t border-zinc-300">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} ByteWard Solutions. All rights
            reserved.
          </p>
          <div className="flex space-x-4">
            <Link href="/privacy-terms">Privacy & Terms</Link>
            <Link
              href="https://bytewardsolutions.co.uk/contact"
              target="_blank"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
