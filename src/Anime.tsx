import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./components/ui/card";
import { Search } from "lucide-react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { Input } from "./components/ui/input";
import { DevTool } from "@hookform/devtools";
import { AnimeListResponse } from "./api-response";

type FormValue = {
  search: string;
};

function AnimeList({ name }: { name: string }) {
  const [page, setPage] = useState(1);
  const [allAnime, setAllAnime] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);

  const { isPending, error, data } = useQuery<AnimeListResponse>({
    queryKey: ["anime", name, page],
    queryFn: () =>
      fetch(`/api/anime?q=${name}&page=${page}&limit=5`).then((res) =>
        res.json()
      ),
    enabled: !!name && hasMore,
  });

  useEffect(() => {
    if (data) {
      setAllAnime((prev) => [...prev, ...data.data]);
      setHasMore(data.hasMore ?? data.data.length > 0);
    }
  }, [data]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isPending) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMore, isPending]);

  if (!name) {
    return <p className="mt-4">Search for an anime, e.g: Naruto</p>;
  }

  if (isPending && page === 1) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <div>
      {allAnime.map((anime) => (
        <Card key={anime.mal_id}>
          <CardHeader>
            <CardTitle>
              <a href={anime.url} target="_blank" rel="noreferrer">
                {anime.title}
              </a>
            </CardTitle>
            <CardDescription>
              <span>
                {anime.type} - {anime.episodes} episodes - {anime.duration}.
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent className="flex gap-4">
            <img
              alt={anime.title}
              className="object-cover rounded-md aspect-square"
              src={anime.images.webp.image_url}
            />
            <p>{anime.synopsis}</p>
          </CardContent>
        </Card>
      ))}
      {hasMore && (
        <div ref={loaderRef} className="py-4 text-center">
          {isPending ? <p>Loading more...</p> : <p>Scroll to load more</p>}
        </div>
      )}
    </div>
  );
}
export function Anime() {
  const [searchBy, setSearchBy] = useState("");
  const { control, handleSubmit } = useForm({
    defaultValues: {
      search: "",
    },
  });

  const onSubmit: SubmitHandler<FormValue> = (data) => {
    setSearchBy(data.search);
  };

  return (
    <div className="flex flex-col">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="relative flex-1 gap-4 ml-auto md:grow-0">
          <Search className="absolute top-2.5 left-2.5 w-4 h-4 text-muted-foreground" />
          <Controller
            name="search"
            control={control}
            render={({ field }) => (
              <Input
                placeholder="Search..."
                className="pl-8 w-full rounded-lg bg-background md:w-[200px] lg:w-[336px]"
                {...field}
              />
            )}
          />
        </div>
      </form>
      <AnimeList name={searchBy} />
      <DevTool control={control} />
    </div>
  );
}
