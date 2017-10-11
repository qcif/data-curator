<template>
  <div id="aboutProperties" class="panel-group">
    <ul class="list-group" v-for="(list, index) in aboutProps" :key="index">
      <li :style="aboutListStyle" class="list-group-item" v-for="(item, index) in list.items" :key="index">
        <template v-if="item.image">
          <a v-if="item.link" :href="item.link"><img :height="item.height" width="auto" :src="item.image" /></a>
          <img v-else :src="item.image" />
        </template>
        <template v-if="item.label">
          <a :style="item.style" v-if="item.link" :href="item.link">{{item.label}}</a>
          <span :style="item.style" v-else>{{item.label}}</span>
        </template>
      </li>
    </ul>
<!--
    <ul :style="listStyle">We acknowledge the great work of others. We are:
      <li :style="listItemStyle">inspired by the <a href="https://theodi.org/">ODI</a> experiment, <a href="https://comma-chameleon.io/">Comma Chameleon</a></li>
      <li :style="listItemStyle">using the <a href="https://okfn.org/">Open Knowledge International</a> Frictionless Data <a href="http://frictionlessdata.io/">specification</a> and <a href="http://frictionlessdata.io/tools/#javascript">code libraries</a></li>
      <li :style="listItemStyle">adopting <a href="https://www.w3.org/TR/dwbp/#bp-summary">W3C Data on the Web Best Practices</a></li>
      <li :style="listItemStyle">proudly using <a href="https://github.com/ODIQueensland/data-curator/blob/master/README.md">open source software</a></li>
    </ul>
    <div>
      Learn how you can <a href="https://github.com/ODIQueensland/data-curator/blob/master/.github/CONTRIBUTING.md">contribute to Data Curator</a>
    </div>
-->
  </div>
</template>
<script>
import {remote} from 'electron'
export default {
  name: 'about',
  data() {
    return {
      aboutListStyle: {
        fontWeight: 'bold',
        textAlign: 'center',
        border: 'none'
      },
      listStyle: {
        'paddingLeft': '0'
      },
      listItemStyle: {
        'paddingLeft': '5px'
      },
      aboutProps: [{
        items: [{
          image: 'static/img/data-curator-banner.png',
          link: 'https://theodi.org.au/data-curator/'
        },
        {
          label: this.getApplicationVersion()
        }
        ]
      },
      {
        items: [
          {
            label: `Beta version ${this.getApplicationVersion()} - access the support forum or report issues via the help menu`
          }
        ]
      },
      {
        items: [{
          image: 'static/img/advance_qld_logo.png',
          link: 'http://advance.qld.gov.au/',
          height: '56px'
        },
        {
          label: 'Funded by the Queensland Government'
        }
        ]
      },
      {
        items: [{
          image: 'static/img/odi_aus_logo.png',
          link: 'https://theodi.org.au/',
          height: '48px'
        },
        {
          label: 'Coordinated by the ODI Australian Network'
        }
        ]
      },
      {
        items: [{
          image: 'static/img/qcif_logo.png',
          link: 'https://www.qcif.edu.au',
          height: '60px'
        },
        {
          label: 'Includes software developed by the Queensland Cyber Infrastructure Foundation on behalf of the Queensland Government and the ODI Australian Network'
        }
        ]
      }
      ]
    }
  },
  methods: {
    getApplicationVersion: function() {
      return remote.getGlobal('version')
    }
  }
}
</script>
<style scoped>
@import '~bootstrap/dist/css/bootstrap.min.css'
</style>
<style scoped>
@import '~static/css/panels'
</style>
<style lang="styl" scoped>
@import '~static/css/panel'
</style>
