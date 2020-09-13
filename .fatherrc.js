/*
 * @Author: panda
 * @Date: 2020-05-07 13:16:47
 * @LastEditTime: 2020-05-07 18:37:13
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \fatherTest\.fatherrc.js
 */
export default {
    entry: 'src/index.ts',
    file: 'main',
    doc: {
      themeConfig: { mode: 'dark' },
      base: '/your-repo'
    },
    esm: 'rollup',
    // cjs: 'rollup',
  }