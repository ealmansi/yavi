with

neighbourhood_fst_ord as (
  select page_id as page_id, outlink as link
  from enwiki20160501.page_outlinks
  where page_id = ${central_page_id} and page_id <> outlink
  intersect
  select outlink as page_id, page_id as link
  from enwiki20160501.page_outlinks
  where outlink = ${central_page_id} and page_id <> outlink
),

neighbourhood_snd_ord as (
  select page_id, outlink as link
  from enwiki20160501.page_outlinks
  where page_id in (select link from neighbourhood_fst_ord) and page_id <> outlink
  intersect
  select outlink as page_id, page_id as link
  from enwiki20160501.page_outlinks
  where outlink in (select link from neighbourhood_fst_ord) and page_id <> outlink
),

relatedness_scores as (
  select
    nso.page_id as page_id,
    1.0 * count(nfo.page_id) / (count(*) + (select count(*) from neighbourhood_fst_ord)) as score
  from neighbourhood_snd_ord nso
  left join neighbourhood_fst_ord nfo on nso.link = nfo.link
  group by nso.page_id
),

result as (
  select *
  from relatedness_scores
  where score > 0
  order by score desc
  limit 100
)

select *
from result
