<template>
<form class="navbar-form form-horizontal" id="tableProperties">
  <div class="form-group-sm row container-fluid">
    <div v-for="(formprop, index) in formprops" :key="index">
      <label :style="{paddingLeft: '0'}" class="control-label col-sm-4" :for="formprop.label">{{formprop.label}}:</label>
      <input type="text" class="form-control input-sm col-sm-8" :id="formprop.label" />
    </div>
  </div>
</form>
</template>
<script>
export default {
  name: 'sidenav',
  data() {
    return {
      formprops: [{
        label: 'name'
      },
      {
        label: 'title'
      },
      {
        label: 'description'
      },
      {
        label: 'type',
        type: 'dropdown'
      },
      {
        label: 'format',
        type: 'dropdown'
      },
      {
        label: 'rdfType',
        type: 'url'
      },
      {
        label: 'contraints',
        type: 'json'
      }
      ]
    }
  }
}
</script>
