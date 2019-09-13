const { get, set, isEmpty, flatten } = require("lodash")
const compose = require("lodash/fp/compose")
const generateAuthors = require("./authors.js")
const generateMedias = require("./medias.js")
const generateModules = require("./modules.js")
const generatePages = require("./pages.js")
const generateTags = require("./tags.js")
const generateChapterTypes = require("./chapterTypes.js")
const generateChaptersPerModule = require("./chapters.js")
const { randomEntries, randomIntBetween } = require("./_utils")

const getId = entity => get(entity, "id")

const extractIds = list => (isEmpty(list) ? [] : list.map(getId))

const makeEntityEnhancer = ({ min, max, pool, path }) => entities =>
  entities.map(src => {
    const count = randomIntBetween(min, max)
    const entries = randomEntries(pool, count)
    return set(src, path, entries)
  })

const makeChapterEnhancer = ({ chaptersPerModule, path }) => entities =>
  entities.map((src, idx) => {
    const entries = extractIds(chaptersPerModule[idx])
    return set(src, path, entries)
  })

const countModules = modulesBase => get(modulesBase, "modules.length", 0)

module.exports = () => {
  // generate entities in base format (unconnected)
  const mediasBase = generateMedias({ count: 100 })
  const authorsBase = generateAuthors({ count: 20 })
  const modulesBase = generateModules()
  const pagesBase = generatePages()
  const tagsBase = generateTags({ count: 20 })
  const chapterTypes = generateChapterTypes()
  const chaptersPerModule = generateChaptersPerModule({
    chapterTypes,
    moduleCount: countModules(modulesBase),
  })
  const chaptersBase = flatten(chaptersPerModule)

  // extract ids
  const allAuthorIds = extractIds(authorsBase.authors)
  const allMediaIds = extractIds(mediasBase.medias)
  const allModuleIds = extractIds(modulesBase.modules)
  const allTagIds = extractIds(tagsBase)

  // make enhancer
  const addRandomMediaIds = makeEntityEnhancer({
    min: 0,
    max: 10,
    pool: allMediaIds,
    path: "content.medias",
  })

  const addRandomAuthorIds = makeEntityEnhancer({
    min: 0,
    max: 3,
    pool: allAuthorIds,
    path: "content.authors",
  })

  const addRandomModuleIds = makeEntityEnhancer({
    min: 1,
    max: 3,
    pool: allModuleIds,
    path: "content.modules",
  })

  const addRandomTagIds = makeEntityEnhancer({
    min: 0,
    max: 10,
    pool: allTagIds,
    path: "content.tags",
  })

  const addChapters = makeChapterEnhancer({
    chaptersPerModule,
    path: "content.chapters",
  })

  // connect entities
  return {
    authors: {
      ...authorsBase,
      authors: compose(
        addRandomMediaIds,
        addRandomModuleIds
      )(authorsBase.authors),
    },
    chapters: addRandomMediaIds(chaptersBase),
    medias: {
      ...mediasBase,
      medias: compose(
        addRandomAuthorIds,
        addRandomModuleIds,
        addRandomTagIds
      )(mediasBase.medias),
    },
    modules: {
      ...modulesBase,
      modules: compose(
        addRandomAuthorIds,
        addChapters
      )(modulesBase.modules),
    },
    pages: pagesBase,
    tags: tagsBase,
  }
}
