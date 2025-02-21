"use client"

import { motion } from "framer-motion"
import Link from "next/link"

interface FooterSectionProps {
    title: string
    links: Array<{ label: string; href: string }>
    delay?: number
}

export function FooterSection({ title, links, delay = 0 }: FooterSectionProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}
        >
            <h3 className="mb-4 text-sm font-semibold text-foreground">{title}</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
                {links.map((link) => (
                    <li key={link.label}>
                        <Link
                            href={link.href}
                            className="transition-colors hover:text-primary"
                        >
                            {link.label}
                        </Link>
                    </li>
                ))}
            </ul>
        </motion.div>
    )
}
