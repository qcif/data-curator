import _ from 'lodash'
import fs from 'fs-extra'
import os from 'os'
import { searchColor } from './style'

export function getRowIndicesOfCaseInsensitiveSearchText (activeColRows, searchValue) {
  const matchedTextIndices = []
  for (const [index, next] of activeColRows.entries()) {
    if ((next.toLowerCase()).includes(searchValue.toLowerCase())) {
      matchedTextIndices.push(index)
    }
  }
  console.log(`matched is:...`)
  console.dir(matchedTextIndices)
  return matchedTextIndices
}

export function getRowIndicesOfCaseSensitiveSearchText (activeColRows, searchValue) {
  const matchedTextIndices = []
  for (const [index, next] of activeColRows.entries()) {
    if ((next).includes(searchValue)) {
      matchedTextIndices.push(index)
    }
  }
  return matchedTextIndices
}

export function getRowIndicesOfFoundBackgroundColors (backgroundColors) {
  const foundBackgroundColors = []
  for (const [index, next] of backgroundColors.entries()) {
    if (next.value === searchColor) {
      foundBackgroundColors.push(index)
    }
  }
  return foundBackgroundColors
}
