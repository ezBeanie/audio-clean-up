<template>
  <div class="app">
    <h1 class="title">{{ $t('title') }}</h1>
    <Accordion :value="[0]" multiple>
      <AccordionPanel value="0">
        <AccordionHeader>Upload videos</AccordionHeader>
        <AccordionContent>
          <h5>Select video files to process</h5>
          <FileUpload
            name="files[]"
            url="/api/separate-audios"
            @upload="onAdvancedUpload($event)"
            :multiple="true"
            accept=".wav"
          >
            <template #empty>
              <span>Drag and drop video files to here to upload.</span>
            </template>
          </FileUpload>
          <Toast />
        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel value="1">
        <AccordionHeader>Files processing</AccordionHeader>
        <AccordionContent>
          <p class="m-0">
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
            laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
            architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas
            sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
            voluptatem sequi nesciunt. Consectetur, adipisci velit, sed quia non numquam eius modi.
          </p>
        </AccordionContent>
      </AccordionPanel>
      <AccordionPanel value="2">
        <AccordionHeader>Files finished</AccordionHeader>
        <AccordionContent>
          <p class="m-0">
            At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium
            voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint
            occaecati cupiditate non provident, similique sunt in culpa qui officia deserunt
            mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et
            expedita distinctio. Nam libero tempore, cum soluta nobis est eligendi optio cumque
            nihil impedit quo minus.
          </p>
        </AccordionContent>
      </AccordionPanel>
    </Accordion>
  </div>
</template>

<script setup>
import Toast from 'primevue/toast';
import Accordion from 'primevue/accordion';
import AccordionHeader from 'primevue/accordionheader';
import AccordionContent from 'primevue/accordioncontent';
import AccordionPanel from 'primevue/accordionpanel';
import FileUpload from 'primevue/fileupload';
import { useToast } from 'primevue/usetoast';
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const toast = useToast();

onMounted(() => {});

const onAdvancedUpload = (event) => {
  console.error('event', event);
  toast.add({ severity: 'success', summary: 'Success', detail: 'File(s) Uploaded', life: 3000 });
};
</script>

<style scoped lang="scss">
.app {
  min-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.title {
  text-align: center;
  margin-bottom: 2rem;
}
</style>
