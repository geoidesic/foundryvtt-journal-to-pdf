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
    log.d('application', application)


    // const options = {
    //   format: "A4",
    //   path: `${__dirname}/sample.pdf`, // you can pass path to save the file
    // };

    // const browser = await puppeteer.launch();
    // const page = await browser.newPage();

    // const content = "<h1>Welcome to puppeteer-html-pdf</h1>";
    Hooks.call("makePDF", application)
    // await page.setContent(content, { waitUntil: 'networkidle0', ...timeout });
    // const pdfBuffer = await this.generatePDF(page);

  }

  let draggable = application.reactive.draggable;
  draggable = true

  $: application.reactive.draggable = draggable;

  onMount(async () => {
  });
  
</script>

<svelte:options accessors={true}/>

<template lang="pug">
  ApplicationShell(bind:elementRoot)
    button(role="button" on:mousedown="{clickHandler}") Generate PDF
    main
      p Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Scelerisque in dictum non consectetur a erat nam at. Facilisis sed odio morbi quis. Ornare aenean euismod elementum nisi quis eleifend quam adipiscing vitae. In est ante in nibh mauris cursus. Convallis tellus id interdum velit laoreet id donec ultrices tincidunt. Vel facilisis volutpat est velit egestas dui id. Tristique magna sit amet purus gravida quis. Et pharetra pharetra massa massa ultricies mi. Justo eget magna fermentum iaculis eu. Dictumst quisque sagittis purus sit amet volutpat consequat. Vehicula ipsum a arcu cursus vitae congue mauris rhoncus aenean. In tellus integer feugiat scelerisque varius morbi enim nunc faucibus. Tempor orci dapibus ultrices in iaculis nunc sed augue. Ac turpis egestas integer eget aliquet nibh praesent tristique magna. Eget lorem dolor sed viverra ipsum. Risus in hendrerit gravida rutrum quisque non. Sagittis nisl rhoncus mattis rhoncus urna neque viverra justo nec.

      p Hac habitasse platea dictumst vestibulum rhoncus est. In nibh mauris cursus mattis molestie a. Sit amet mauris commodo quis imperdiet massa tincidunt. Eu volutpat odio facilisis mauris sit amet. Tincidunt praesent semper feugiat nibh. Platea dictumst quisque sagittis purus sit amet. Commodo odio aenean sed adipiscing diam donec adipiscing tristique. Gravida in fermentum et sollicitudin. Varius morbi enim nunc faucibus a pellentesque sit. Sed nisi lacus sed viverra tellus in hac habitasse platea. Aliquam faucibus purus in massa tempor nec feugiat. Magna fermentum iaculis eu non.

      p Ut venenatis tellus in metus. Nisl tincidunt eget nullam non nisi est sit amet facilisis. Donec ultrices tincidunt arcu non sodales neque. Vel elit scelerisque mauris pellentesque pulvinar pellentesque habitant morbi. Sed viverra tellus in hac habitasse platea dictumst vestibulum. Sed pulvinar proin gravida hendrerit lectus. Amet consectetur adipiscing elit pellentesque. Egestas tellus rutrum tellus pellentesque eu tincidunt tortor. Orci a scelerisque purus semper eget duis at tellus at. Risus in hendrerit gravida rutrum quisque non. Risus feugiat in ante metus. Vitae suscipit tellus mauris a. Quam elementum pulvinar etiam non quam lacus. Diam maecenas sed enim ut sem viverra. Facilisis mauris sit amet massa vitae tortor condimentum lacinia quis. Etiam tempor orci eu lobortis elementum. Amet mauris commodo quis imperdiet. Vitae proin sagittis nisl rhoncus mattis rhoncus urna neque. Quam elementum pulvinar etiam non quam. Ornare arcu dui vivamus arcu felis bibendum ut tristique.

      p Id neque aliquam vestibulum morbi. Urna id volutpat lacus laoreet non curabitur gravida arcu ac. Ut aliquam purus sit amet luctus venenatis lectus. Laoreet non curabitur gravida arcu ac tortor. Mi quis hendrerit dolor magna eget. Pulvinar etiam non quam lacus. Massa massa ultricies mi quis. Congue quisque egestas diam in arcu cursus euismod. Tristique et egestas quis ipsum. Porttitor massa id neque aliquam vestibulum morbi blandit cursus. Ultrices tincidunt arcu non sodales neque sodales ut etiam. Venenatis cras sed felis eget velit aliquet sagittis. Arcu non odio euismod lacinia. Elementum sagittis vitae et leo duis. Nibh cras pulvinar mattis nunc sed blandit libero. Ridiculus mus mauris vitae ultricies leo integer malesuada. Nunc sed velit dignissim sodales ut eu. Eu lobortis elementum nibh tellus molestie nunc.

      p Semper feugiat nibh sed pulvinar proin gravida. Eget mauris pharetra et ultrices neque ornare. Cursus mattis molestie a iaculis at erat pellentesque. Aliquet bibendum enim facilisis gravida neque convallis a. Egestas maecenas pharetra convallis posuere morbi leo urna molestie. Dictumst quisque sagittis purus sit amet volutpat consequat. Erat velit scelerisque in dictum non consectetur a. Faucibus ornare suspendisse sed nisi lacus sed viverra tellus. Amet mauris commodo quis imperdiet massa tincidunt nunc pulvinar sapien. Ultrices sagittis orci a scelerisque purus semper. Metus vulputate eu scelerisque felis imperdiet proin. Commodo odio aenean sed adipiscing diam donec adipiscing. Proin sagittis nisl rhoncus mattis.
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
