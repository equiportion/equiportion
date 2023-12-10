<script setup lang="ts">

/**
 * @component {TransactionTile} - Partial that shows transactions as a tile
 * @author Leandro El Omari
 * 
 * @prop {transaction} transaction - A transaction.
 */

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
        <!--first column shows the purpose of the transaction-->
        <div class="flex lg:w-1/3 justify-center mx-2 mt-2 lg:mt-0">
            <span class="flex flex-col justify-center truncate text-gray-700">
                {{ props.transaction.getPurpose() }}
            </span>
        </div>
        <!--second column shows the creditor and the amount paid of the transaction-->
        <div class="flex lg:w-1/3 justify-center mx-2 mt-2 lg:mt-0">
            <span class="flex flex-col justify-center truncate text-gray-700">
                {{ props.transaction.getSum() }}€, gezahlt von {{ props.transaction.getCreditor() }}
            </span>
        </div>
        <!--third column shows all debitors and the amount they owe-->
        <div class="flex flex-col lg:w-1/3 justify-center mx-2 mt-2 lg:mt-0">
            <span class="flex flex-col justify-center text-center truncate text-gray-700"
            v-for="debitor in props.transaction.getDebtors()"
            :key="debitor.user"
            >
                {{ debitor.user }} schuldet {{ debitor.amount }}€
            </span>
        </div>
    </div>
</template>