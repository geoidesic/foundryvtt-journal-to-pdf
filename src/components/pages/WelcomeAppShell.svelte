<svelte:options accessors={true} />

<script>
  import { onMount, getContext } from "svelte";
  import { fade, scale } from "svelte/transition";
  import { ApplicationShell } from "@typhonjs-fvtt/runtime/svelte/component/application";
  import { localize as t } from "~/src/helpers/utility";
  import { MODULE_ID, MODULE_TITLE } from "~/src/helpers/constants";

  export let elementRoot = void 0;
  export const version = void 0;

  const application = getContext("#external").application;

  const handleChange = (event) => {
    game.settings.set(MODULE_ID, "dontShowWelcome", event.target.checked);
  };

  let draggable = application.reactive.draggable;
  draggable = true;

  $: application.reactive.draggable = draggable;
  $: dontShowWelcome = game.settings.get(MODULE_ID, "dontShowWelcome");

  onMount(async () => {
    // Module initialization complete
  });
</script>

<template lang="pug">
  ApplicationShell(bind:elementRoot)
    main
      section.info
        h1 {MODULE_TITLE}
        p A simple module that allows you to create a PDF from a journal.
      hr
      section.advert
        p Check out our free module&nbsp;
          a.advert-link(href="https://foundryvtt.com/packages/foundryvtt-actor-studio") Actor Studio
          | , which helps your players create and manage their characters with ease.
        .flexrow.justify-flexrow-vertical
          .flex2
            a.advert-link(href="https://foundryvtt.com/packages/foundryvtt-actor-studio")
              img(src="modules/foundryvtt-actor-studio/assets/actor-studio-blue.png" alt="Actor Studio" style="height: 100%; max-height: 50px; border: none; width: auto;")
        hr
        .flexrow.justify-flexrow-vertical(data-tooltip="{t('Setting.DontShowWelcome.Hint')}")
          .flex0(style="margin-right: 5px")
            input(type="checkbox" on:change="{handleChange}" label="{t('Setting.DontShowWelcome.Name')}" bind:checked="{dontShowWelcome}") 
          .flex.dont-show
            span {t('Setting.DontShowWelcome.Name') }
    footer
      div.logo
        a(href="https://www.aardvark.games") 
          img.white(src="/modules/foundryvtt-actor-studio/assets/aardvark-logo.webp" alt="Aardvark Game Studios Logo" height="50" width="50" style="fill: white; border: none; width: auto;")
      div.left
        div {t("Title")}
        //- a(href="https://www.round-table.games") Round Table Games
        a(href="https://www.aardvark.games") {t("Welcome.CreatedBy")} 
    

</template>

<style lang="sass">
  @use "../../../styles/Mixins.sass" as mixins
  .theme-dark
    .bg-dark
      background-color: rgba(0, 0, 0, 0.1)
      padding: 1rem 1rem 0.5rem 1rem

  main
    overflow-y: auto
    i
      margin-right: 0.5em
    .inset
      @include mixins.inset
    .bg-dark
      background-color: rgba(0, 0, 0, 0.1)
      padding: 1rem 1rem 0.5rem 1rem
    h1
      margin-top: 0
    h4
      font-family: var(--dnd5e-font-modesto);
  .dont-show
    font-size: smaller

  p.thanks
    font-size: 1.2em
    font-weight: bold
    color: #416dbe

  footer
    border-top: 8px ridge var(--border-shadow)
    display: grid
    grid-template-columns: 2fr 4fr
    position: fixed
    bottom: 0
    align-items: center
    gap: 1em
    line-height: 2em
    left: 0
    right: 0
    background-color: #333
    color: white
    padding: 1em
    font-size: 0.8em
    z-index: 3
    div.logo
      a
        display: flex
        align-items: center
        justify-content: end
        gap: 0.5em
    a
      color: white
      text-decoration: underline
      &:hover
        color: #ccc


</style>

