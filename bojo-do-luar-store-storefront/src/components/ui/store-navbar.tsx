"use client"

import { Home, Package, User, ShoppingCart } from "lucide-react"
import { NavBar } from "./tubelight-navbar"
import { useEffect, useState } from "react"
import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { HttpTypes } from "@medusajs/types"

export function StoreNavBar() {
  const [cart, setCart] = useState<HttpTypes.StoreCart | null>(null)
  const [customer, setCustomer] = useState<HttpTypes.StoreCustomer | null>(null)

  useEffect(() => {
    retrieveCart().then(setCart).catch(() => setCart(null))
    retrieveCustomer().then(setCustomer).catch(() => setCustomer(null))
  }, [])

  const navItems = [
    { name: 'Home', url: '/', icon: Home },
    { name: 'Products', url: '/store', icon: Package },
    { name: customer ? 'Account' : 'Login', url: '/account', icon: User },
    { name: 'Cart', url: '/cart', icon: ShoppingCart }
  ]

  return <NavBar items={navItems} cart={cart} />
}
