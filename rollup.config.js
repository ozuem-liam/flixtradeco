import replace from '@rollup/plugin-replace';

export default {
    input: './app.js',
    output: {
        file: './build/bundle.min.js',
        format: 'iife',
        name: 'bundle'
    },
    plugins: [
        replace({
            preventAssignment: true,
            'process.browser': true,
            'process.env.NODE_ENV': JSON.stringify(mode)
        }),
      ],
};