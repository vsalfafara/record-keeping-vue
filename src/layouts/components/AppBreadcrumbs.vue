<template>
  <Breadcrumb>
    <BreadcrumbList>
      <template
        v-for="(breadcrumb, index) in breadcrumbs"
        :key="breadcrumb.name"
      >
        <BreadcrumbItem>
          <BreadcrumbPage v-if="breadcrumb.name === route.name">
            {{ breadcrumb.name }}
          </BreadcrumbPage>
          <BreadcrumbLink v-else as-child>
            <RouterLink :to="{ name: breadcrumb.name }">{{
              breadcrumb.name
            }}</RouterLink>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator v-if="index < breadcrumbs.length - 1" />
      </template>
    </BreadcrumbList>
  </Breadcrumb>
</template>

<script setup lang="ts">
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { useBreadcrumbs } from "@/lib/breadcrumbs";
import { useRoute } from "vue-router";

const breadcrumbs = useBreadcrumbs();
const route = useRoute();
</script>
