#!/usr/bin/env bash

# Check args.
if [ ! $# -ge 3 ]
  then
    >&2 echo "Wrong number of arguments supplied. Expecting at least job name, wikipedia id and dump date."
    >&2 echo "Example:"
    >&2 echo "  $0 redirect_map enwiki 20160501"
    exit 1
fi

# Read args.
job_name=$1
wiki_id=$2
dump_date=$3

# Run job.
job_script=":load jobs/$job_name.scala
runJob(\"/home/ealmansi/data/$wiki_id/$dump_date/\", sqlContext)"

(cd $(dirname $0) &&
  echo "$job_script" |
  spark-shell --packages com.databricks:spark-avro_2.10:2.0.1 "${@:3}" &)
