#include <stdio.h>
#include <stdlib.h>
#include "candles.h"
#include "indicators.h"

void print_string_list(const char * const list[TI_MAXINDPARAMS], int size) {
  int first = 1;
  printf("[");
  for (int i = 0; i < size; ++i) {
    if (first == 0) printf(", ");
    first = 0;
    printf("\"%s\"", list[i]);
  }
  printf("]");
}

int main() {
  const ti_indicator_info * info = ti_indicators;
  int index = 0;
  printf("[\n");
  while (info->name != 0) {
    if (index != 0) printf(",\n");
    printf("\t{\n");
    printf("\t\t\"index\": %d,\n", index);
    printf("\t\t\"name\": \"%s\",\n", info->name);
    printf("\t\t\"full_name\": \"%s\",\n", info->full_name);
    printf("\t\t\"type\": %d,\n", info->type);
    printf("\t\t\"inputs\": %d,\n", info->inputs);
    printf("\t\t\"options\": %d,\n", info->options);
    printf("\t\t\"outputs\": %d,\n", info->outputs);
    printf("\t\t\"input_names\": ");
    print_string_list(info->input_names, info->inputs);
    printf(",\n");
    printf("\t\t\"option_names\": ");
    print_string_list(info->option_names, info->options);
    printf(",\n");
    printf("\t\t\"output_names\": ");
    print_string_list(info->output_names, info->outputs);
    printf("\n");
    printf("\t}");
    ++index;
    ++info;
  }
  printf("\n]\n");
  return 0;
}
