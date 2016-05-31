with

num_revisions_window_3 as (
  select page_id, (
      select sum(num_revisions)
      from enwiki20160501.daily_signals dsi
      where
        dsi.page_id = ds.page_id and
        ${start_day} <= dsi.day_number and dsi.day_number <= ${end_day} and
        ds.day_number <= dsi.day_number and
        dsi.day_number < ds.day_number + 3
    ) as num_revisions_per_window
    from enwiki20160501.daily_signals ds
    where
      ds.page_id in (${page_ids:csv}) and
      ${start_day} <= ds.day_number and ds.day_number <= ${end_day}
),

max_num_revisions_window_3 as (
  select page_id, max(num_revisions_per_window)
  from num_revisions_window_3
  group by page_id
),

num_revisions_window_7 as (
  select page_id, (
      select sum(num_revisions)
      from enwiki20160501.daily_signals dsi
      where
        dsi.page_id = ds.page_id and
        ${start_day} <= dsi.day_number and dsi.day_number <= ${end_day} and
        ds.day_number <= dsi.day_number and
        dsi.day_number < ds.day_number + 7
    ) as num_revisions_per_window
    from enwiki20160501.daily_signals ds
    where
      ds.page_id in (${page_ids:csv}) and
      ${start_day} <= ds.day_number and ds.day_number <= ${end_day}
),

max_num_revisions_window_7 as (
  select page_id, max(num_revisions_per_window)
  from num_revisions_window_7
  group by page_id
),

num_revisions_window_10 as (
  select page_id, (
      select sum(num_revisions)
      from enwiki20160501.daily_signals dsi
      where
        dsi.page_id = ds.page_id and
        ${start_day} <= dsi.day_number and dsi.day_number <= ${end_day} and
        ds.day_number <= dsi.day_number and
        dsi.day_number < ds.day_number + 10
    ) as num_revisions_per_window
    from enwiki20160501.daily_signals ds
    where
      ds.page_id in (${page_ids:csv}) and
      ${start_day} <= ds.day_number and ds.day_number <= ${end_day}
),

max_num_revisions_window_10 as (
  select page_id, max(num_revisions_per_window)
  from num_revisions_window_10
  group by page_id
)

select
  mnrw3.page_id,
  mnrw3.max as max_window_3,
  mnrw7.max as max_window_7,
  mnrw10.max as max_window_10,
  mnrw3.max * 10 + mnrw7.max * 2 + mnrw10.max as score
from max_num_revisions_window_3 mnrw3
inner join max_num_revisions_window_7 mnrw7 on mnrw3.page_id = mnrw7.page_id
inner join max_num_revisions_window_10 mnrw10 on mnrw3.page_id = mnrw10.page_id
order by score desc
limit 10
