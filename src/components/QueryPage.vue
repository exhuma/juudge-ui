<template>
  <v-container class="fill-height">
    <v-responsive class="align-centerfill-height mx-auto">
      <v-card
        style="max-width: 60rem; margin: 1em auto;"
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
      <v-card
        class="my-4"
        style="max-width: 60rem; margin: 1em auto;"
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
            filled
            label="Response"
            readonly
            rows="3"
          />
        </v-card-text>
      </v-card>
      <h2 vi-if="contexts.length > 0"
        style="max-width: 60rem; margin: 1em auto;"
        >Additional Context</h2>
      <v-card
        class="my-4"
        style="max-width: 60rem; margin: 1em auto;"
        color="surface-variant"
        rounded="lg"
        variant="outlined"
        v-for="(context, i) in contexts"
        :key="`context-${i}`"
      >
        <v-card-title>
          <h2 class="text-h5 font-weight-bold">{{ context.metadata.type }}</h2>
        </v-card-title>
        <v-card-subtitle v-if="context.metadata.name">
          <strong>Card Name:</strong> {{ context.metadata.name }}
        </v-card-subtitle>
        <v-card-text>
          <pre v-if="nonScryfallIdentifiers(context).length > 0">{{
            JSON.stringify(nonScryfallIdentifiers(context), null, 2)
          }}</pre>
          <p>{{ context.raw_content }}</p>
          <template v-if="scryfallIdentifiers(context).length > 0">
            <hr class="my-2" />
            <ul class="ml-4">
              <li
                v-for="identifier in scryfallIdentifiers(context)"
                :key="identifier"
              >
                Scryfall Tagger:
                <a
                  target="_blank"
                  :href="`https://tagger.scryfall.com/card/oracle/${identifier}`"
                >
                  {{ identifier }}
                </a>
              </li>
            </ul>
          </template>
        </v-card-text>
      </v-card>
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
let username = "john.doe";
let password = "secret";
if (instance) {
  const { proxy } = instance;
  if (proxy) {
    // @ts-expect-error "$config" is injected and unknown by TS
    apiUrl = proxy.$config.apiUrl;
    // @ts-expect-error "$config" is injected and unknown by TS
    username = proxy.$config.username;
    // @ts-expect-error "$config" is injected and unknown by TS
    password = proxy.$config.password;
  }
}

const sendQuery = async () => {
  if (!query.value.trim()) {
    return;
  }
  loading.value = true;
  const service = new ApiService(apiUrl, { username, password });
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

const nonScryfallIdentifiers = (
  context: ContextInfo
): { name: string; value: string }[] => {
  const output: { name: string; value: string }[] = [];
  if (!context.metadata.identifiers) {
    return output;
  }
  Object.entries(context.metadata.identifiers).map(([key, value]) => {
    if (key !== "scryfallOracleId") {
      output.push({ name: key, value: value });
    }
  });
  return output;
};

const scryfallIdentifiers = (context: ContextInfo): string[] => {
  const output: string[] = [];
  if (!context.metadata.identifiers) {
    return output;
  }
  Object.entries(context.metadata.identifiers).map(([key, value]) => {
    if (key === "scryfallOracleId") {
      output.push(value);
    }
  });
  return output;
};
</script>
