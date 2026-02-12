import {defineConfig} from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';
export default defineConfig({
  plugins:[react()],
  resolve:{
    alias:{
      '@':path.resolve(__dirname,'.'),
    }
  },
  test:{
    globals:true,
    environment:'happy-dom',
    setupFiles:['./vitest.setup.tsx'],
  
   
    coverage:{
      provider:'v8',
      reporter:["text","jsdom","html"],
      exclude:[
        'node_modules',
        'dist',
        'build',
        'out',
        'coverage',
        'public',
        'vitest.config.ts',
      ],
      include:[
        'src/**/*.{ts,tsx}',
        'components/**/*.{ts,tsx}',
      
        'lib/**/*.{ts,tsx}',
        'store/**/*.{ts,tsx}',
        'convex/**/*.{ts,tsx}',
        './__tests__/**/*.{ts,tsx}',
      ]
    }

  }
})