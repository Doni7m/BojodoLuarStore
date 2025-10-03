import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { Text, clx } from "@medusajs/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import MedusaCTA from "@modules/layout/components/medusa-cta"

function isExternal(href: string) {
  return href.startsWith("http")
}

type LinkItem = { label: string; href: string }

const SUPPORT: LinkItem[] = [
  { label: "Apoio ao cliente", href: "/ajuda" },
  { label: "Acompanha a tua encomenda", href: "/conta/encomendas" },
  { label: "Como comprar", href: "/como-comprar" },
  { label: "Meios de pagamento", href: "/pagamentos" },
  { label: "Opções de envio", href: "/envio" },
  { label: "Devoluções e trocas", href: "/devolucoes" },
  { label: "Cancelar comunicações", href: "/preferencias" },
  { label: "Contacto", href: "/contacto" },
  { label: "Compras para grupos profissionais", href: "/b2b" },
  { label: "Configurações de cookies", href: "#cookie-settings" }, // liga ao teu gestor de consentimento
]

const CAMPAIGNS: LinkItem[] = [
  { label: "Campanhas", href: "/campanhas" },
  { label: "Termos e Condições Promoções", href: "/legais/termos-promocoes" },
  { label: "Recomenda e Ganha 10€", href: "/refer-a-friend" },
  { label: "-10% Desconto Estudante", href: "/estudantes" },
  // Exemplos “inspirados” nos teus itens
  { label: "Dá a tua opinião e ganha 50€", href: "/inqueritos" },
  { label: "Black Friday", href: "/black-friday" },
]

const COMPANY: LinkItem[] = [
  { label: "Bojo do Luar", href: "/sobre" },
  { label: "A empresa", href: "/empresa" },
  { label: "Lojas", href: "/lojas" },
  { label: "Conselhos & Dicas de Vinho", href: "/conteudos" },
  { label: "Filosofia", href: "/filosofia" },
  { label: "Trabalha connosco", href: "/carreiras" },
  { label: "Marketplace", href: "/marketplace" },
  { label: "Glossário", href: "/glossario" },
  { label: "Best Waves of Wine", href: "/best-waves" },
]

const LEGAL: LinkItem[] = [
  { label: "Informações gerais", href: "/legais/info" },
  { label: "Termos de uso", href: "/legais/termos" },
  { label: "Lei dos Serviços Digitais (DSA)", href: "/legais/dsa" },
  { label: "Termos e Condições Marketplace", href: "/legais/marketplace" },
  { label: "Política de privacidade", href: "/legais/privacidade" },
  { label: "Política de Cookies", href: "/legais/cookies" },
  { label: "Livro de reclamações", href: "https://www.livroreclamacoes.pt/" },
  { label: "Whistleblowing", href: "/legais/whistleblowing" },
  { label: "Sitemap", href: "/sitemap" },
]

const SOCIAL: LinkItem[] = [
  { label: "Instagram", href: "https://instagram.com/" },
  { label: "Facebook", href: "https://facebook.com/" },
  { label: "YouTube", href: "https://youtube.com/" },
  { label: "LinkedIn", href: "https://linkedin.com/" },
]

const APPS: LinkItem[] = [
  { label: "Apple Store", href: "https://apps.apple.com/" },
  { label: "Google Play", href: "https://play.google.com/store" },
]

const PAYMENTS: { label: string }[] = [
  { label: "Multibanco" },
  { label: "MB Way" },
  { label: "Visa" },
  { label: "Mastercard" },
  { label: "PayPal" },
  { label: "Klarna" },
  { label: "Apple Pay" },
  { label: "Google Pay" },
]

export default async function Footer() {
  const { collections } = await listCollections({ fields: "*products" })
  const productCategories = await listCategories()

  const LinkRenderer = ({ item }: { item: LinkItem }) =>
    isExternal(item.href) ? (
      <a
        href={item.href}
        target="_blank"
        rel="noreferrer"
        className="hover:text-ui-fg-base"
      >
        {item.label}
      </a>
    ) : (
      <LocalizedClientLink href={item.href} className="hover:text-ui-fg-base">
        {item.label}
      </LocalizedClientLink>
    )

  return (
    <footer className="border-t border-ui-border-base w-full">
      <div className="content-container flex flex-col w-full">
        {/* Top */}
        <div className="flex flex-col gap-y-8 xsmall:flex-row items-start justify-between py-16 md:py-20">
          <div className="min-w-[220px]">
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus text-ui-fg-subtle hover:text-ui-fg-base uppercase tracking-wide"
            >
              Bojo do Luar Store
            </LocalizedClientLink>
            <p className="mt-3 text-ui-fg-muted txt-small">
              Linha de apoio: <a href="tel:+351910000000" className="hover:text-ui-fg-base">+351 910 000 000</a>
              <span className="mx-2">•</span>
              <a href="mailto:apoio@bojo.pt" className="hover:text-ui-fg-base">apoio@bojo.pt</a>
            </p>
          </div>

          {/* Columns */}
          <div className="text-small-regular gap-10 md:gap-x-14 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {/* Categories (dinâmico) */}
            {productCategories && productCategories.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <span className="txt-small-plus txt-ui-fg-base">Categorias</span>
                <ul className="grid grid-cols-1 gap-2" data-testid="footer-categories">
                  {productCategories.slice(0, 6).map((c) => {
                    if (c.parent_category) return null
                    const children =
                      c.category_children?.map((child) => ({
                        name: child.name,
                        handle: child.handle,
                        id: child.id,
                      })) || null

                    return (
                      <li className="flex flex-col gap-2 text-ui-fg-subtle txt-small" key={c.id}>
                        <LocalizedClientLink
                          className={clx(
                            "hover:text-ui-fg-base",
                            children && "txt-small-plus"
                          )}
                          href={`/categories/${c.handle}`}
                          data-testid="category-link"
                        >
                          {c.name}
                        </LocalizedClientLink>
                        {children && (
                          <ul className="grid grid-cols-1 ml-3 gap-2">
                            {children.map((child) => (
                              <li key={child.id}>
                                <LocalizedClientLink
                                  className="hover:text-ui-fg-base"
                                  href={`/categories/${child.handle}`}
                                  data-testid="category-link"
                                >
                                  {child.name}
                                </LocalizedClientLink>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}

            {/* Collections (dinâmico) */}
            {collections && collections.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <span className="txt-small-plus txt-ui-fg-base">Coleções</span>
                <ul
                  className={clx(
                    "grid grid-cols-1 gap-2 text-ui-fg-subtle txt-small",
                    { "grid-cols-2": (collections?.length || 0) > 3 }
                  )}
                >
                  {collections.slice(0, 6).map((c) => (
                    <li key={c.id}>
                      <LocalizedClientLink
                        className="hover:text-ui-fg-base"
                        href={`/collections/${c.handle}`}
                      >
                        {c.title}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Suporte */}
            <div className="flex flex-col gap-y-2">
              <span className="txt-small-plus txt-ui-fg-base">Apoio ao Cliente</span>
              <ul className="grid grid-cols-1 gap-y-2 text-ui-fg-subtle txt-small">
                {SUPPORT.map((item) => (
                  <li key={item.label}>
                    <LinkRenderer item={item} />
                  </li>
                ))}
              </ul>
            </div>

            {/* Campanhas */}
            <div className="flex flex-col gap-y-2">
              <span className="txt-small-plus txt-ui-fg-base">Campanhas</span>
              <ul className="grid grid-cols-1 gap-y-2 text-ui-fg-subtle txt-small">
                {CAMPAIGNS.map((item) => (
                  <li key={item.label}>
                    <LinkRenderer item={item} />
                  </li>
                ))}
              </ul>
            </div>

            {/* Empresa */}
            <div className="flex flex-col gap-y-2">
              <span className="txt-small-plus txt-ui-fg-base">A Empresa</span>
              <ul className="grid grid-cols-1 gap-y-2 text-ui-fg-subtle txt-small">
                {COMPANY.map((item) => (
                  <li key={item.label}>
                    <LinkRenderer item={item} />
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div className="flex flex-col gap-y-2">
              <span className="txt-small-plus txt-ui-fg-base">Informações gerais</span>
              <ul className="grid grid-cols-1 gap-y-2 text-ui-fg-subtle txt-small">
                {LEGAL.map((item) => (
                  <li key={item.label}>
                    <LinkRenderer item={item} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Social, Apps e Pagamentos */}
        <div className="py-8 border-t border-ui-border-base grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <span className="txt-small-plus txt-ui-fg-base">Redes Sociais</span>
            <ul className="mt-3 flex flex-wrap gap-4 text-ui-fg-subtle txt-small">
              {SOCIAL.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer" className="hover:text-ui-fg-base">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="txt-small-plus txt-ui-fg-base">Descarregar a App</span>
            <ul className="mt-3 flex flex-wrap gap-4 text-ui-fg-subtle txt-small">
              {APPS.map((a) => (
                <li key={a.label}>
                  <a href={a.href} target="_blank" rel="noreferrer" className="hover:text-ui-fg-base">
                    {a.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="txt-small-plus txt-ui-fg-base">Modo de pagamento</span>
            <ul className="mt-3 flex flex-wrap gap-3 text-ui-fg-subtle txt-small">
              {PAYMENTS.map((p) => (
                <li key={p.label} className="px-2 py-1 rounded-md border border-ui-border-base">
                  {p.label}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex w-full py-6 justify-between items-center text-ui-fg-muted">
          <Text className="txt-compact-small">
            © {new Date().getFullYear()} Bojo do Luar Store. Todos os direitos reservados.
          </Text>
          <div className="flex items-center gap-4">
            <span className="txt-compact-small">Powered by</span>
            <MedusaCTA />
          </div>
        </div>
      </div>
    </footer>
  )
}
