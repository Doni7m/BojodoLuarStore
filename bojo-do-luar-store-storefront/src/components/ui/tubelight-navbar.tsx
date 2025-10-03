"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { LucideIcon } from "lucide-react"
import { cn } from "@lib/utils"
import {
  Transition,
} from "@headlessui/react"
import { Fragment } from "react"
import { convertToLocale } from "@lib/util/money"
import { Button } from "@medusajs/ui"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { HttpTypes } from "@medusajs/types"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
  cart?: HttpTypes.StoreCart | null
}

export function NavBar({ items, className, cart }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name)
  const [isMobile, setIsMobile] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)

  const totalItems = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <div
      className={cn(
        "fixed bottom-0 sm:top-0 left-1/2 -translate-x-1/2 z-50 mb-1 sm:pt-6 h-fit",
        className,
      )}
    >
      <div className="flex items-center gap-3 bg-background/5 border border-border backdrop-blur-lg py-1 px-1 rounded-full shadow-lg w-fit">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name

          if (item.name === "Cart" && cart) {
            return (
              <div
                key={item.name}
                className="relative"
                onMouseEnter={() => setCartOpen(true)}
                onMouseLeave={() => setCartOpen(false)}
              >
                <Link
                  href={item.url}
                  onClick={() => setActiveTab(item.name)}
                  className={cn(
                    "relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors",
                    "text-foreground/80 hover:text-primary",
                    isActive && "bg-muted text-primary",
                  )}
                >
                  <span className="hidden md:inline">Cart ({totalItems})</span>
                  <span className="md:hidden">
                    <Icon size={18} strokeWidth={2.5} />
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="lamp"
                      className="absolute inset-0 w-full bg-primary/5 rounded-full -z-10"
                      initial={false}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    >
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full">
                        <div className="absolute w-12 h-6 bg-primary/20 rounded-full blur-md -top-2 -left-2" />
                        <div className="absolute w-8 h-6 bg-primary/20 rounded-full blur-md -top-1" />
                        <div className="absolute w-4 h-4 bg-primary/20 rounded-full blur-sm top-0 left-2" />
                      </div>
                    </motion.div>
                  )}
                </Link>
                <Transition
                  show={cartOpen}
                  as={Fragment}
                  enter="transition ease-out duration-200"
                  enterFrom="opacity-0 translate-y-1"
                  enterTo="opacity-100 translate-y-0"
                  leave="transition ease-in duration-150"
                  leaveFrom="opacity-100 translate-y-0"
                  leaveTo="opacity-0 translate-y-1"
                >
                  <div
                    className={cn(
                      "hidden small:block absolute right-0 bg-white/10 backdrop-blur-xl border border-white/20 w-[420px] rounded-xl shadow-2xl text-ui-fg-base z-50",
                      isMobile ? "bottom-full" : "top-full"
                    )}
                  >
                    <div className="p-4 flex items-center justify-center">
                      <h3 className="text-large-semi">Cart</h3>
                    </div>
                    {cart.items?.length ? (
                      <>
                        <div className="overflow-y-scroll max-h-[402px] px-4 grid grid-cols-1 gap-y-8 no-scrollbar p-px">
                          {cart.items
                            .sort((a, b) => {
                              return (a.created_at ?? "") > (b.created_at ?? "")
                                ? -1
                                : 1
                            })
                            .map((item) => (
                              <div
                                className="grid grid-cols-[122px_1fr] gap-x-4"
                                key={item.id}
                              >
                                <Link
                                  href={`/products/${item.product_handle}`}
                                  className="w-24"
                                >
                                  <Thumbnail
                                    thumbnail={item.thumbnail}
                                    images={item.variant?.product?.images}
                                    size="square"
                                  />
                                </Link>
                                <div className="flex flex-col justify-between flex-1">
                                  <div className="flex flex-col flex-1">
                                    <div className="flex items-start justify-between">
                                      <div className="flex flex-col overflow-ellipsis whitespace-nowrap mr-4 w-[180px]">
                                        <h3 className="text-base-regular overflow-hidden text-ellipsis">
                                          <Link
                                            href={`/products/${item.product_handle}`}
                                          >
                                            {item.title}
                                          </Link>
                                        </h3>
                                        <LineItemOptions
                                          variant={item.variant}
                                        />
                                        <span>
                                          Quantity: {item.quantity}
                                        </span>
                                      </div>
                                      <div className="flex justify-end">
                                        <LineItemPrice
                                          item={item}
                                          style="tight"
                                          currencyCode={cart.currency_code}
                                        />
                                      </div>
                                    </div>
                                  </div>
                                  <DeleteButton
                                    id={item.id}
                                    className="mt-1"
                                  >
                                    Remove
                                  </DeleteButton>
                                </div>
                              </div>
                            ))}
                        </div>
                        <div className="p-4 flex flex-col gap-y-4 text-small-regular">
                          <div className="flex items-center justify-between">
                            <span className="text-ui-fg-base font-semibold">
                              Subtotal{" "}
                              <span className="font-normal">(excl. taxes)</span>
                            </span>
                            <span className="text-large-semi">
                              {convertToLocale({
                                amount: cart.subtotal ?? 0,
                                currency_code: cart.currency_code,
                              })}
                            </span>
                          </div>
                          <Link href="/cart" passHref>
                            <Button
                              className="w-full"
                              size="large"
                            >
                              Go to cart
                            </Button>
                          </Link>
                        </div>
                      </>
                    ) : (
                      <div>
                        <div className="flex py-16 flex-col gap-y-4 items-center justify-center">
                          <div className="bg-gray-900 text-small-regular flex items-center justify-center w-6 h-6 rounded-full text-white">
                            <span>0</span>
                          </div>
                          <span>Your shopping bag is empty.</span>
                          <div>
                            <Link href="/store">
                              <Button onClick={() => setCartOpen(false)}>
                                Explore products
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </Transition>
              </div>
            )
          }

          return (
            <Link
              key={item.name}
              href={item.url}
              onClick={() => setActiveTab(item.name)}
              className={cn(
                "relative cursor-pointer text-sm font-semibold px-6 py-2 rounded-full transition-colors",
                "text-foreground/80 hover:text-primary",
                isActive && "bg-muted text-primary",
              )}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden">
                <Icon size={18} strokeWidth={2.5} />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-primary/5 rounded-full -z-10"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-t-full">
                    <div className="absolute w-12 h-6 bg-primary/20 rounded-full blur-md -top-2 -left-2" />
                    <div className="absolute w-8 h-6 bg-primary/20 rounded-full blur-md -top-1" />
                    <div className="absolute w-4 h-4 bg-primary/20 rounded-full blur-sm top-0 left-2" />
                  </div>
                </motion.div>
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
