#include <stdio.h>
#include <stdlib.h>
#include "candles.h"
#include "indicators.h"

#define TASK_MAX 1000
#define DATA_MAX 4

typedef struct {
  int enabled;
  int target_index;
  int is_outputs;
  int data_index;
} MapInfo;

typedef struct {
  int used;
  int indicator_index;
  int size;
  TI_REAL options[DATA_MAX];
  int inputs_offset;
  TI_REAL * inputs[DATA_MAX];
  int outputs_offset;
  TI_REAL * outputs[DATA_MAX];
  MapInfo inputs_map[DATA_MAX];
} Task;

Task task_list[TASK_MAX];
int next_task = 0;
int first = 1;

// 释放任务
void free_task(int task_index) {
  Task * task = &task_list[task_index];
  ti_indicator_info * indicator = &ti_indicators[task->indicator_index];
  for (int i = 0; i < indicator->inputs; ++i)
    if (!task->inputs_map[i].enabled) free(task->inputs[i]);
  for (int i = 0; i < indicator->outputs; ++i)
    free(task->outputs[i]);
  task->used = 0;
}

// 释放当前任务并回退
void free_current() {
  if (--next_task < 0) next_task = TASK_MAX - 1;
  if (task_list[next_task].used) free_task(next_task);
}

// 释放并重置所有任务
void reset() {
  for (int i = 0; i < TASK_MAX; ++i)
    if (task_list[i].used) free_task(i);
  next_task = 0;
}

// 初始化模块
void init() {
  for (int i = 0; i < TASK_MAX; ++i)
    task_list[i].used = 0;
  next_task = 0;
}

// 新建任务
int new_task(int indicator_index, int size) {
  if (first) init();
  first = 0;
  Task * task = &task_list[next_task];
  ti_indicator_info * indicator = &ti_indicators[indicator_index];
  if (task->used) free_task(next_task);
  task->indicator_index = indicator_index;
  task->size = size;
  for (int i = 0; i < DATA_MAX; ++i) {
    task->inputs[i] = NULL;
    task->inputs_map[i].enabled = 1;
  }
  for (int i = 0; i < indicator->outputs; ++i)
    task->outputs[i] = malloc(sizeof(TI_REAL) * size);
  task->used = 1;
  int task_index = next_task;
  if (++next_task >= TASK_MAX) next_task = 0;
  return task_index;
}

// 编辑输入数据
void inputs_number(
  int task_index,
  int input_index,
  int offset,
  TI_REAL number
) {
  Task * task = &task_list[task_index];
  if (task->inputs[input_index] == NULL)
    task->inputs[input_index] = malloc(sizeof(TI_REAL) * task->size);
  task->inputs[input_index][offset] = number;
  task->inputs_map[input_index].enabled = 0;
}

// 编辑输入映射
void inputs_map(
  int task_index,
  int input_index,
  int target_index,
  int is_outputs,
  int data_index
) {
  MapInfo * info = &task_list[task_index].inputs_map[input_index];
  info->enabled = 1;
  info->target_index = target_index;
  info->is_outputs = is_outputs;
  info->data_index = data_index;
}

// 编辑参数数据
void options_number(int task_index, int offset, TI_REAL number) {
  task_list[task_index].options[offset] = number;
}

// 获取输出数据
TI_REAL outputs_number(int task_index, int output_index, int offset) {
  return task_list[task_index].outputs[output_index][offset];
}

// 获取输入数据
TI_REAL get_inputs_number(int task_index, int input_index, int offset) {
  return task_list[task_index].inputs[input_index][offset];
}

// 获取输入偏移
int inputs_offset(int task_index) {
  return task_list[task_index].inputs_offset;
}

// 获取输出偏移
int outputs_offset(int task_index) {
  return task_list[task_index].outputs_offset;
}

// 链接任务
void link_task(int task_index) {
  Task * task = &task_list[task_index];
  ti_indicator_info * indicator = &ti_indicators[task->indicator_index];
  int inputs_offset = 0;
  for (int i = 0; i < indicator->inputs; ++i) {
    MapInfo * info = &task->inputs_map[i];
    if (info->enabled) {
      Task * target = &task_list[info->target_index];
      const int offset = info->is_outputs ? target->outputs_offset :
        target->inputs_offset;
      task->inputs[i] = info->is_outputs ? target->outputs[info->data_index] :
        target->inputs[info->data_index];
      if (offset > inputs_offset) inputs_offset = offset;
    }
  }
  task->inputs_offset = inputs_offset;
}

// 运行任务
void run_task(int task_index, int only_start) {
  Task * task = &task_list[task_index];
  ti_indicator_info * indicator = &ti_indicators[task->indicator_index];
  if (only_start) {
    task->outputs_offset = indicator->start(task->options);
    return;
  }
  link_task(task_index);
  task->outputs_offset = task->inputs_offset + indicator->start(task->options);
  const TI_REAL * inputs[DATA_MAX];
  TI_REAL * outputs[DATA_MAX];
  for (int i = 0; i < indicator->inputs; ++i)
    inputs[i] = &task->inputs[i][task->inputs_offset];
  for (int i = 0; i < indicator->outputs; ++i)
    outputs[i] = &task->outputs[i][task->outputs_offset];
  indicator->indicator(
    task->size - task->inputs_offset,
    inputs,
    task->options,
    outputs
  );
}

// 批量运行任务
void run(int start_index, int end_index) {
  for (int i = start_index; i <= end_index; ++i)
    run_task(i, 0);
}
