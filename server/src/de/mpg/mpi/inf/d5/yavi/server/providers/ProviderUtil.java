package de.mpg.mpi.inf.d5.yavi.server.providers;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.Query;

import org.eclipse.persistence.config.HintValues;
import org.eclipse.persistence.config.QueryHints;

import com.google.common.base.Joiner;

class ProviderUtil {
  @SuppressWarnings("unchecked")
  public static <T> List<T> getPageEntriesInRange(String table, int pageId, String wikipediaId, int dayFrom, int dayTo) {
    EntityManager entityManager = ProviderUtil.getEntityManagerByWikipediaId(wikipediaId);
    String queryStatement = Joiner.on("\n").join(
        "SELECT e",
        "FROM " + table + " e",
        "WHERE",
          "e.id.pageId = :pageId AND",
          "e.id.dayNumber >= :dayFrom AND",
          "e.id.dayNumber <= :dayTo"
    );
    Query query = entityManager.createQuery(queryStatement);
    query.setHint(QueryHints.READ_ONLY, HintValues.TRUE);
    query.setParameter("pageId", pageId);
    query.setParameter("dayFrom", dayFrom);
    query.setParameter("dayTo", dayTo);
    List<T> resultList = query.getResultList();
    return resultList;
  }

  @SuppressWarnings("unchecked")
  public static <T> List<T> getPagesEntriesInRange(String table, Set<Integer> pageIds, String wikipediaId, int dayFrom, int dayTo) {
    if (pageIds.isEmpty()) {
      return new ArrayList<>();
    }
    EntityManager entityManager = ProviderUtil.getEntityManagerByWikipediaId(wikipediaId);
    String queryStatement = Joiner.on("\n").join(
        "SELECT e",
        "FROM " + table + " e",
        "WHERE",
          "e.id.pageId IN :pageIds AND",
          "e.id.dayNumber >= :dayFrom AND",
          "e.id.dayNumber <= :dayTo"
    );
    Query query = entityManager.createQuery(queryStatement);
    query.setHint(QueryHints.READ_ONLY, HintValues.TRUE);
    query.setParameter("pageIds", pageIds);
    query.setParameter("dayFrom", dayFrom);
    query.setParameter("dayTo", dayTo);
    List<T> resultList = query.getResultList();
    return resultList;
  }

  @SuppressWarnings("unchecked")
  public static <T> List<T> getPageEntriesTillDay(String table, int pageId, String wikipediaId, int dayTo) {
    EntityManager entityManager = ProviderUtil.getEntityManagerByWikipediaId(wikipediaId);
    String queryStatement = Joiner.on("\n").join(
        "SELECT e",
        "FROM " + table + " e",
        "WHERE",
          "e.id.pageId = :pageId AND",
          "e.id.dayNumber <= :dayTo"
    );
    Query query = entityManager.createQuery(queryStatement);
    query.setHint(QueryHints.READ_ONLY, HintValues.TRUE);
    query.setParameter("pageId", pageId);
    query.setParameter("dayTo", dayTo);
    List<T> resultList = query.getResultList();
    return resultList;
  }

  @SuppressWarnings("unchecked")
  public static <T> List<T> getPagesEntriesTillDay(String table, Set<Integer> pageIds, String wikipediaId, int dayTo) {
    if (pageIds.isEmpty()) {
      return new ArrayList<>();
    }
    EntityManager entityManager = ProviderUtil.getEntityManagerByWikipediaId(wikipediaId);
    String queryStatement = Joiner.on("\n").join(
        "SELECT e",
        "FROM " + table + " e",
        "WHERE",
          "e.id.pageId IN :pageIds AND",
          "e.id.dayNumber <= :dayTo"
    );
    Query query = entityManager.createQuery(queryStatement);
    query.setHint(QueryHints.READ_ONLY, HintValues.TRUE);
    query.setParameter("pageIds", pageIds);
    query.setParameter("dayTo", dayTo);
    List<T> resultList = query.getResultList();
    return resultList;
  }

  public static EntityManager getEntityManagerByWikipediaId(String wikipediaId) {
    String persistenceUnit = wikipediaId + "wiki";
    EntityManagerFactory entityManagerFactory =
        Persistence.createEntityManagerFactory(persistenceUnit);
    return entityManagerFactory.createEntityManager();
  }
}
