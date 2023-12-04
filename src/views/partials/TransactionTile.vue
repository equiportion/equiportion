<script setup lang="ts">
import TransactionEvent from '@/logic/models/events/TransactionEvent';


const props = defineProps({
    transaction: {
        type: TransactionEvent,
        required: true,
    }
});
</script>

<template>
    <div class="flex flex-col lg:flex-row m-2">
        <div class="flex lg:w-1/3 justify-center mx-2 mt-2 lg:mt-0">
            <span class="flex flex-col justify-center truncate text-gray-700">
                {{ transaction.getPurpose() }}
            </span>
        </div>
        <div class="flex lg:w-1/3 justify-center mx-2 mt-2 lg:mt-0">
            <span class="flex flex-col justify-center truncate text-gray-700">
                {{ transaction.getSum() }}€, gezahlt von {{ transaction.getCreditor() }}
            </span>
        </div>
        <div class="flex flex-col lg:w-1/3 justify-center mx-2 mt-2 lg:mt-0">
            <span class="flex flex-col justify-center text-center truncate text-gray-700"
            v-for="debitor in transaction.getDebtors()"
            :key="debitor.user"
            >
                {{ debitor.user }} schuldet {{ debitor.amount }}€
            </span>
        </div>
    </div>
</template>