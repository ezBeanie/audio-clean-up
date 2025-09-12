<template>
  <div class="card">
    <Toast />
    <FileUpload
      name="audioFiles"
      url="/api/upload-audio"
      @upload="onAdvancedUpload($event)"
      :multiple="true"
      accept=".wav"
    >
      <template #empty>
        <span>Drag and drop files to here to upload.</span>
      </template>
    </FileUpload>
  </div>
</template>

<script setup>
import Toast from 'primevue/toast';
import FileUpload from 'primevue/fileupload';
import { useToast } from 'primevue/usetoast';
import { onMounted } from 'vue';
const toast = useToast();

onMounted(() => {
  document.title = 'Audio Uploader';
  //await fetch('/upload-audio')
});

const onAdvancedUpload = () => {
  toast.add({ severity: 'info', summary: 'Success', detail: 'File Uploaded', life: 3000 });
};
</script>

<style scoped></style>
