# Netlify CMS Reader

[![Build Status](https://travis-ci.org/tb/netlify-cms-reader.svg?branch=master)](https://travis-ci.org/tb/netlify-cms-reader)
[![npm version](https://badge.fury.io/js/netlify-cms-reader.svg)](http://badge.fury.io/js/netlify-cms-reader)

Read NetlifyCMS config and data.

## Basic usage

    const { getConfig, getData } = require('netlify-cms-reader')
    
    const data = await getData(getConfig('static/admin/config.yml'))

## Usage with GatsbyJS

    const path = require('path')
    const { getConfig, getData } = require('netlify-cms-reader')

    exports.createPages = async ({ actions, graphql }) => {
      const { createPage } = actions

      const { pages } = await getData(getConfig('static/admin/config.yml'))
    
      pages.forEach(page => {
        createPage({
          path: page.path,
          component: path.resolve('src/templates/page.js'),
          context: { page },
        })
      })
    }
