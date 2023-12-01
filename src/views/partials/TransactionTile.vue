<script setup lang="ts">

defineProps({
    transaction: {
        type: Object,
        required: true,
    },
})

</script>

<template>
    <div class="flex flex-row h-32 mt-2 rounded-lg border-r-8 border-b-8 bg-gray-100 border-gray-200">
        <div class="flex flex-col w-1/3 h-32 items-center justify-center">{{ transaction.content.purpose }}</div>
        <div class="flex flex-col w-1/3 h-32 items-center justify-center">{{ transaction.content.sum }}€ gezahlt von {{ transaction.content.creditor }}</div>
        <div class="flex flex-col w-1/3 h-32 items-center justify-center">
            <div>Schuldner:</div>
            <div v-for="debitor of transaction.content.debitors" :key="debitor.user">
                {{ debitor.user }}, {{ debitor.amount }}€
            </div>
        </div>
    </div>
</template>