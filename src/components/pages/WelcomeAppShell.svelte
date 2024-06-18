<script>
  import { onMount, getContext } from "svelte";
  import { fade, scale }        from 'svelte/transition';
  import { ApplicationShell }   from '#runtime/svelte/component/core';
  import { localize } from "#runtime/svelte/helper";
  import { MODULE_ID, MODULE_TITLE } from "~/src/helpers/constants";
  import { log } from "~/src/helpers/utility";


  export let elementRoot = void 0;
  export let version = void 0;

  const application = getContext('#external').application;

  const clickHandler = async (event) => {
    Hooks.call("makePDF", application)
  }

  const handleChange = (event) => {
    game.settings.set(MODULE_ID, 'dontShowWelcome', event.target.checked);
  }

  let draggable = application.reactive.draggable;
  draggable = true

  $: application.reactive.draggable = draggable;
  $: dontShowWelcome = game.settings.get(MODULE_ID, 'dontShowWelcome');

  onMount(async () => {
  });
  
</script>

<svelte:options accessors={true}/>

<template lang="pug">
  ApplicationShell(bind:elementRoot)
    main
      section.info
        h1 {MODULE_TITLE}
        p A simple module that allows you to create a PDF from a journal. 
        h2 Usage intructions
        p Open a journal and click the "Make PDF" button to create a PDF of the journal.
      hr
      section.opt-out
        .flexrow.inset.justify-flexrow-vertical(data-tooltip="{localize('GJP.Setting.DontShowWelcome.Hint')}")
          .flex0
            input(type="checkbox" on:change="{handleChange}" label="{localize('GJP.Setting.DontShowWelcome.Name')}" bind:checked="{dontShowWelcome}") 
          .flex
            span {localize('GJP.Setting.DontShowWelcome.Name') }
    footer
      p {MODULE_TITLE} is sponsored by 
      a(href="https://www.round-table.games") Round Table Games

</template>

<style lang="sass">
  @import "../../../styles/Mixins.scss"

  main
    @include inset
    overflow-y: auto
    margin-bottom: 5em

  footer
    position: fixed
    bottom: 0
    left: 0
    right: 0
    background-color: #333
    color: white
    text-align: center
    padding: 1em
    font-size: 0.8em
    a
      color: white
      text-decoration: underline
      &:hover
        color: #ccc
</style>
