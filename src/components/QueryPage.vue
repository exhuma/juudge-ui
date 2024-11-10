<template>
  <v-container class="fill-height">
    <v-responsive class="align-centerfill-height mx-auto">
      <v-row>
        <v-col cols="6">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-card
                  class="py-4"
                  color="surface-variant"
                  rounded="lg"
                  variant="outlined"
                >
                  <template #title>
                    <h2 class="text-h5 font-weight-bold">Question</h2>
                  </template>
                  <v-card-text>
                    <v-textarea
                      v-model="query"
                      auto-grow
                      :disabled="loading"
                      clearable
                      filled
                      label="Enter your query"
                      placeholder="Type your query here"
                      rows="10"
                      @keydown.enter.prevent="sendQuery"
                    />
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-card
                  class="py-4"
                  color="surface-variant"
                  rounded="lg"
                  variant="outlined"
                >
                  <template #title>
                    <h2 class="text-h5 font-weight-bold">Answer</h2>
                  </template>
                  <v-card-text>
                    <v-textarea
                      v-model="response"
                      :loading="loading"
                      auto-grow
                      disabled
                      filled
                      label="Response"
                      rows="10"
                    />
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </v-col>
        <v-col cols="6">
          <v-card
            class="my-4"
            color="surface-variant"
            rounded="lg"
            variant="outlined"
            v-for="(context, i) in contexts"
            :key="`context-${i}`"
          >
            <v-card-title>
              <h2 class="text-h5 font-weight-bold">Additional Context</h2>
            </v-card-title>
            <v-card-text>
              Name: {{ context.metadata.name }} <br />
              Type: {{ context.metadata.type }} <br />
              Identifiers: {{ JSON.stringify(context.metadata.identifiers) }}
              <br />
              Raw:
              <p>{{ context.raw_content }}</p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-responsive>
  </v-container>
</template>

<script setup lang="ts">
import { ApiService } from "@/core/apiservice";
import { ContextInfo } from "@/remoteModel/QueryResponse";
import { ref, getCurrentInstance } from "vue";

const response = ref("");
const contexts = ref([] as ContextInfo[]);
const query = ref("");
const loading = ref(false);

// Access the global config value
const instance = getCurrentInstance();
let apiUrl = "http://localhost:8000";
if (instance) {
  const { proxy } = instance;
  if (proxy) {
    // @ts-expect-error "$config" is injected and unknown by TS
    apiUrl = proxy.$config.apiUrl;
  }
}

const sendQuery = async () => {
  if (!query.value.trim()) {
    return;
  }
  loading.value = true;
  console.log(apiUrl);
  const service = new ApiService(apiUrl);
  try {
    const result = await service.query(query.value);
    response.value = result.answer;
    contexts.value = result.contexts;
  } catch (error) {
    console.error("Failed to send query:", error);
  } finally {
    loading.value = false;
  }
};
</script>
