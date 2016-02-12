package de.mpg.mpi.inf.d5.yavi.server.providers;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import javax.persistence.EntityManager;
import javax.persistence.Query;

import com.google.common.base.Joiner;
import com.google.common.collect.ImmutableSet;
import com.google.common.collect.Iterables;

import de.mpg.mpi.inf.d5.yavi.server.tables.AddedOutlink;

public class NeighbourhoodProvider {
  public Set<Long> getPageNeighbourhood(long pageId, String wikipediaId, int dayFrom, int dayTo) {
    EntityManager entityManager = ProviderUtil.getEntityManagerByWikipediaId(wikipediaId);
    String queryStatement = Joiner.on("\n").join(
        "SELECT e",
        "FROM AddedOutlink e",
        "WHERE",
          "e.id.pageId = :pageId AND",
          "e.id.dayNumber >= :dayFrom AND",
          "e.id.dayNumber <= :dayTo"
    );
    Query query = entityManager.createQuery(queryStatement);
    query.setParameter("pageId", pageId);
    query.setParameter("dayFrom", dayFrom);
    query.setParameter("dayTo", dayTo);
    query.setMaxResults(500);
    Set<Long> neighbourhood = new HashSet<>();
    for (Object entryObject : query.getResultList()) {
      AddedOutlink entry = (AddedOutlink) entryObject;
      long entryOutlink = entry.getId().getOutlink();
      neighbourhood.add(entryOutlink);
    }
    neighbourhood.remove(pageId);
    return neighbourhood;
  }
  
  public Map<Long, Set<Long>> getPageNeighbourhoods(Set<Long> pageIds, String wikipediaId, int dayFrom, int dayTo) {
    EntityManager entityManager = ProviderUtil.getEntityManagerByWikipediaId(wikipediaId);
    String queryStatement = Joiner.on("\n").join(
        "SELECT e",
        "FROM AddedOutlink e",
        "WHERE",
          "e.id.pageId IN :pageIds AND",
          "e.id.dayNumber >= :dayFrom AND",
          "e.id.dayNumber <= :dayTo"
    );
    Query query = entityManager.createQuery(queryStatement);
    query.setParameter("pageIds", ImmutableSet.copyOf(Iterables.limit(pageIds, 1000)));
    query.setParameter("dayFrom", dayFrom);
    query.setParameter("dayTo", dayTo);
    Map<Long, Set<Long>> neighbourhoods = new HashMap<>();
    for (Object entryObject : query.getResultList()) {
      AddedOutlink entry = (AddedOutlink) entryObject;
      long entryPageId = entry.getId().getPageId();
      long entryOutlink = entry.getId().getOutlink();
      if (!neighbourhoods.containsKey(entryPageId)) {
        neighbourhoods.put(entryPageId, new HashSet<Long>());
      }
      neighbourhoods.get(entryPageId).add(entryOutlink);
    }
    return neighbourhoods;
  }
}
