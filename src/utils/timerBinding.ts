// run as pnpm tsx -e "import { timerBinding } from './src/utils/timerBinding.ts'; timerBinding();"
export const timerBinding = () => {
    for (let i = 0; i < 10; i++) {
        setTimeout(() => console.log("Param: %d", (i + 111)), 0);
    }
};
