export const useUiHelpers: any = () => {
  const route: any = useRoute();
  const router = useRouter();
  const { loadProducts } = useCategory();

  const { query, path } = route;
  const productAttributes = reactive<any>({
    attributes: [],
  });

  const queryParamsNotFilters = ['page', 'sort', 'itemsPerPage'];
  const localePrefixes = ['/en', '/de', '/ru'];
  const pathToSlug = (): string => {
    for (const localePrefix of localePrefixes) {
      if (path.startsWith(localePrefix)) {
        return path.replace(localePrefix, '');
      }
    }
    return path;
  };

  const getGroups = async (params: any) => {
    const { attributes } = await loadProducts(params);
    if (!attributes) return [];

    const data: any = [];

    attributes.forEach((item: any) => {
      const current = data.find(
        (itemData: { attributeName: any }) =>
          itemData.attributeName === item.attribute?.name
      );

      if (!current) {
        data.push({
          id: String(item.attribute.id),
          label: item.attribute?.name,
          attributeName: item.attribute?.name,
          type: item.displayType,
          count: 0,
          options: [],
        });
      }

      data
        .find(
          (itemData: { attributeName: any }) =>
            itemData.attributeName === item.attribute?.name
        )
        .options.push({
          id: String(item.search),
          value: item.id,
          label: item.name,
          metadata: item.search,
          htmlColor: item.htmlColor,
        });
    });
    productAttributes.attributes = data;
    return data;
  };

  const getAttributeValues = (filterKey: string, value: string) => {
    let attribute: any = {};

    attribute = productAttributes.attributes?.find(
      (item: { label: string }) => {
        return item.label === filterKey;
      }
    );

    let option = {};
    if (attribute) {
      option = attribute?.options.find((item: { value: any }) => {
        return Number(item.value) === Number(value.split('-')[0]);
      });
    }
    return option;
  };

  const getFacetsFromURL = (QueryFromUrl: any) => {
    const filters: string[] = [];
    const query = QueryFromUrl;
    if (query) {
      Object.keys(query).forEach((filterKey) => {
        if (![...queryParamsNotFilters, 'price'].includes(filterKey)) {
          if (query[filterKey].includes(',')) {
            query[filterKey]?.split(',').forEach((label: string) => {
              const getProperAttribute: any = getAttributeValues(
                filterKey,
                label?.split('-')[0]
              );
              filters.push(getProperAttribute?.id);
            });
          } else {
            const label = query[filterKey]?.split(',')[0];
            const getProperAttribute: any = getAttributeValues(
              filterKey,
              label
            );
            filters.push(getProperAttribute?.id);
          }
        }
      });
    }

    const price = query?.price?.split('-');

    const pageSize = query.itemsPerPage ? parseInt(query.itemsPerPage) : 12;
    const sort = query?.sort?.split(',') || [];
    const page = query?.page || 1;

    const productFilters = {
      minPrice: Number(price?.[0]) || null,
      maxPrice: Number(price?.[1]) || null,
      attribValues: filters,
      categorySlug: path === '/' ? null : pathToSlug(),
    };
    const filtersForHash = {
      ...productFilters,
      pageSize,
      price,
      page,
      sort,
    };

    return {
      pageSize,
      currentPage: parseInt(page),
      // cacheKey: `API-P${hash(filtersForHash, { algorithm: 'md5' })}`,
      search: '',
      sort: { [sort[0]]: sort[1] },
      filter: productFilters,
    };
  };
  const facetsFromUrlToFilter = () => {
    const formattedFilters: any = [];
    Object.keys(query).forEach((label) => {
      if (queryParamsNotFilters.includes(label)) return;

      const valueList = query[label].split(',');
      valueList.forEach((value: string) => {
        if (label === 'price') {
          const item = {
            filterName: label,
            label: `${value.slice(0, 2)}`,
            id: value,
          };
          formattedFilters.push(item);
        } else {
          const newVal = value?.split('-');
          const item = {
            filterName: label,
            label: `${newVal[1] ?? newVal[0]}`,
            id: `${newVal[0]}`,
          };
          formattedFilters.push(item);
        }
      });
    });
    return formattedFilters;
  };

  const changeFilters = (filters: any[]) => {
    const formattedFilters: any = {};
    filters.forEach((element) => {
      if (element.filterName === 'Size') {
        if (formattedFilters[element.filterName]) {
          formattedFilters[
            element.filterName
          ] += `,${element.id}-${element.label}`;
          return;
        }
        formattedFilters[element.filterName] = `${element.id}-${element.label}`;
      } else {
        if (formattedFilters[element.filterName]) {
          formattedFilters[element.filterName] += `,${element.id}`;
          return;
        }
        formattedFilters[element.filterName] = `${element.id}`;
      }
    });

    let allQuery: any = {};
    if (filters.length > 0) {
      allQuery = { ...formattedFilters };
    } else {
      allQuery = { ...formattedFilters };
      if (query.itemsPerPage) {
        allQuery = { itemsPerPage: query.itemsPerPage };
      }
    }

    if (query.sort) {
      allQuery.sort = query.sort;
    }

    delete allQuery.page;
    router.push({ query: allQuery });
  };
  return {
    getGroups,
    getFacetsFromURL,
    changeFilters,
    facetsFromUrlToFilter,
  };
};
