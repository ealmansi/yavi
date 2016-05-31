with

result as (
  select *
  from enwiki20160501.daily_signals
  where page_id in (${page_ids:csv})
)

select *
from result
