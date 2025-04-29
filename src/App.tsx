import "./App.css";
import { Anime } from "./Anime";
import {
	Card,
	CardContent,
	CardHeader,
	CardTitle,
} from "./components/ui/card";

export function App() {
	return (
		<div className="flex flex-col w-full min-h-screen">
			<main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
				<Card>
					<CardHeader>
						<CardTitle>Anime List</CardTitle>
					</CardHeader>
					<CardContent>
						<Anime />
					</CardContent>
				</Card>
			</main>
		</div>
	);
}
