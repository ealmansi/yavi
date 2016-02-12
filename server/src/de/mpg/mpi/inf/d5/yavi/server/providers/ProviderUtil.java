package de.mpg.mpi.inf.d5.yavi.server.providers;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.EntityManagerFactory;
import javax.persistence.Persistence;
import javax.persistence.Query;

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
    query.setParameter("pageId", pageId);
    query.setParameter("dayFrom", dayFrom);
    query.setParameter("dayTo", dayTo);
    return query.getResultList();
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
    query.setParameter("pageId", pageId);
    query.setParameter("dayTo", dayTo);
    return query.getResultList();
  }

  public static EntityManager getEntityManagerByWikipediaId(String wikipediaId) {
    String persistenceUnit = wikipediaId + "wiki";
    EntityManagerFactory entityManagerFactory =
        Persistence.createEntityManagerFactory(persistenceUnit);
    return entityManagerFactory.createEntityManager();
  }
}
