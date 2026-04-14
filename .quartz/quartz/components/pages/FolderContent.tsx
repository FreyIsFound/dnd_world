import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "../types"

import style from "../styles/listPage.scss"
import { Root } from "hast"
import { htmlToJsx } from "../../util/jsx"
import { i18n } from "../../i18n"
import { ComponentChildren } from "preact"
import { concatenateResources } from "../../util/resources"
import { trieFromAllFiles } from "../../util/ctx"
import { resolveRelative } from "../../util/path"

interface FolderContentOptions {
  showFolderCount: boolean
  showSubfolders: boolean
}

const defaultOptions: FolderContentOptions = {
  showFolderCount: true,
  showSubfolders: true,
}

type TreeEntry = {
  title: string
  slug?: string
  children?: TreeEntry[]
}

export default ((opts?: Partial<FolderContentOptions>) => {
  const options: FolderContentOptions = { ...defaultOptions, ...opts }

  const FolderContent: QuartzComponent = (props: QuartzComponentProps) => {
    const { tree, fileData, allFiles, cfg } = props

    const trie = (props.ctx.trie ??= trieFromAllFiles(allFiles))
    const folder = trie.findNode(fileData.slug!.split("/"))
    if (!folder) {
      return null
    }

    const buildTree = (node: any): TreeEntry[] => {
      return node.children.flatMap((child: any) => {
        // Real page, including folder pages with index.md
        if (child.data) {
          const title =
            child.data.frontmatter?.title ??
            child.displayName ??
            child.slug.split("/").at(-1)?.replaceAll("-", " ") ??
            "Untitled"

          return [
            {
              title,
              slug: child.slug,
            },
          ]
        }

        // Folder without index.md
        if (child.isFolder && options.showSubfolders) {
          const nestedChildren = buildTree(child)

          if (nestedChildren.length === 0) {
            return []
          }

          return [
            {
              title: child.displayName.replaceAll("-", " "),
              children: nestedChildren,
            },
          ]
        }

        return []
      })
    }

    const countPages = (entries: TreeEntry[]): number => {
      return entries.reduce((count, entry) => {
        if (entry.slug) {
          return count + 1
        }

        if (entry.children) {
          return count + countPages(entry.children)
        }

        return count
      }, 0)
    }

    const renderTree = (entries: TreeEntry[]) => {
      if (entries.length === 0) {
        return null
      }

      return (
        <ul class="folder-tree">
          {entries.map((entry) => (
            <li class="folder-tree-item">
              {entry.slug ? (
                <a href={resolveRelative(fileData.slug!, entry.slug)}>{entry.title}</a>
              ) : (
                <span class="folder-tree-label">{entry.title}</span>
              )}
              {entry.children && renderTree(entry.children)}
            </li>
          ))}
        </ul>
      )
    }

    const itemsTree = buildTree(folder)
    const visiblePageCount = countPages(itemsTree)

    const cssClasses: string[] = fileData.frontmatter?.cssclasses ?? []
    const classes = cssClasses.join(" ")

    const content = (
      (tree as Root).children.length === 0
        ? fileData.description
        : htmlToJsx(fileData.filePath!, tree)
    ) as ComponentChildren

    return (
      <div class="popover-hint">
        <article class={classes}>{content}</article>
        <div class="page-listing">
          {options.showFolderCount && (
            <p>
              {i18n(cfg.locale).pages.folderContent.itemsUnderFolder({
                count: visiblePageCount,
              })}
            </p>
          )}
          <div>{renderTree(itemsTree)}</div>
        </div>
      </div>
    )
  }

    FolderContent.css = concatenateResources(
  style,
  `
  .folder-tree {
    list-style-type: disc;
    padding-left: 1.5rem;
    margin: 0.5rem 0;
  }

  .folder-tree .folder-tree {
    list-style-type: circle;
    margin-top: 0.2rem;
  }

  .folder-tree .folder-tree .folder-tree {
    list-style-type: square;
  }

  .folder-tree .folder-tree .folder-tree .folder-tree {
    list-style-type: disc;
  }

  .folder-tree .folder-tree .folder-tree .folder-tree .folder-tree {
    list-style-type: circle;
  }

  .folder-tree-item {
    margin: 0.2rem 0;
  }

  .folder-tree-item > a,
  .folder-tree-item > .folder-tree-label {
    display: inline-block;
    margin-bottom: 0.1rem;
  }

  .folder-tree-label {
    font-weight: 600;
    color: var(--gray);
  }
  `,
)

  return FolderContent
}) satisfies QuartzComponentConstructor