import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import breadcrumbsStyle from "./styles/breadcrumbs.scss"
import { FullSlug, SimpleSlug, resolveRelative, simplifySlug } from "../util/path"
import { classNames } from "../util/lang"
import { trieFromAllFiles } from "../util/ctx"

type CrumbData = {
  displayName: string
  path: string
  slug: string
}

interface BreadcrumbOptions {
  spacerSymbol: string
  rootName: string
  resolveFrontmatterTitle: boolean
  showCurrentPage: boolean
}

const defaultOptions: BreadcrumbOptions = {
  spacerSymbol: "❯",
  rootName: "Aisling Wiki",
  resolveFrontmatterTitle: true,
  showCurrentPage: true,
}

function formatCrumb(displayName: string, baseSlug: FullSlug, currentSlug: SimpleSlug): CrumbData {
  return {
    displayName: displayName.replaceAll("-", " "),
    path: resolveRelative(baseSlug, currentSlug),
    slug: currentSlug,
  }
}

export default ((opts?: Partial<BreadcrumbOptions>) => {
  const options: BreadcrumbOptions = { ...defaultOptions, ...opts }

  const Breadcrumbs: QuartzComponent = ({
    fileData,
    allFiles,
    displayClass,
    ctx,
  }: QuartzComponentProps) => {
    const trie = (ctx.trie ??= trieFromAllFiles(allFiles))
    const slugParts = fileData.slug!.split("/")
    const pathNodes = trie.ancestryChain(slugParts)

    if (!pathNodes) {
      return null
    }

    const allCrumbs: CrumbData[] = pathNodes.map((node, idx) => {
      const simplifiedSlug = simplifySlug(node.slug)
      const crumb = formatCrumb(node.displayName, fileData.slug!, simplifiedSlug)

      if (idx === 0) {
        crumb.displayName = options.rootName
      }

      if (idx === pathNodes.length - 1) {
        crumb.path = ""
      }

      return crumb
    })

    const normalizeSlug = (slug: string) => slug.toLowerCase().replace(/\/+$/, "")

    const playersIndex = allCrumbs.findIndex((crumb) => {
      const slug = normalizeSlug(crumb.slug)
      return (
        slug === "adventure-campaign/players" ||
        slug.endsWith("/players") ||
        slug === "players"
      )
    })

    let crumbs: CrumbData[]

    if (playersIndex >= 0) {
      const playersAndBelow = allCrumbs.slice(playersIndex + 1)

      crumbs = [
        {
          displayName: options.rootName,
          path: resolveRelative(fileData.slug!, simplifySlug("index")),
          slug: "index",
        },
        ...playersAndBelow,
      ]
    } else {
      crumbs = allCrumbs
    }

    if (!options.showCurrentPage) {
      crumbs.pop()
    }

    return (
      <nav class={classNames(displayClass, "breadcrumb-container")} aria-label="breadcrumbs">
        {crumbs.map((crumb, index) => (
          <div class="breadcrumb-element">
            <a href={crumb.path}>{crumb.displayName}</a>
            {index !== crumbs.length - 1 && <p>{` ${options.spacerSymbol} `}</p>}
          </div>
        ))}
      </nav>
    )
  }

  Breadcrumbs.css = breadcrumbsStyle
  return Breadcrumbs
}) satisfies QuartzComponentConstructor