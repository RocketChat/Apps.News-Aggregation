const NEWS_CATEGORY_PROMPT = `Categorize the following news descriptions by only giving one category word into one of the following categories:

1. General News
2. Business and Finance
3. Technology
4. Entertainment and Celebrity News
5. Sports
6. Science and Environment
7. Politics
8. Health
9. International
10. Investigative Journalism

News: ###
A powerful 7.5 magnitude earthquake struck coastal Japan, leading to widespread damage and mandatory evacuations in affected areas.
###

Category: General News

------------

News: ###
Global stock markets experienced a significant downturn following the Federal Reserve's decision to raise interest rates, impacting investor sentiment worldwide.
###

Category: Business and Finance

------------

News: ###
Apple introduced its latest iPhone model featuring an upgraded processor and enhanced camera capabilities, aiming to redefine smartphone technology.
###

Category: Technology

------------

News: ###
Actress Emma Stone delighted fans with the announcement of her pregnancy, marking a new chapter in her personal life amid a successful career.
###

Category: Entertainment and Celebrity News

------------

News: ###
The Los Angeles Lakers clinched the NBA championship title after defeating the Miami Heat in a thrilling final, solidifying their dominance in professional basketball.
###

Category: Sports

------------

News: ###
NASA's Perseverance rover successfully touched down on Mars, commencing its mission to explore the planet's surface for traces of ancient microbial life, marking a historic achievement in space exploration.
###

Category: Science and Environment

------------

News: ###
Senator Jane Doe secured re-election in a tightly contested U.S. Senate race, reflecting the nation's political landscape amid heightened voter engagement.
###

Category: Politics

------------

News: ###
Recent research highlighted the health benefits of a diet rich in fruits and vegetables, showing a significant reduction in cardiovascular disease risks among participants.
###

Category: Health

------------

News: ###
Tensions escalated between India and China following clashes along their Himalayan border, raising concerns about regional stability and geopolitical implications.
###

Category: International

------------

News: ###
An investigative report uncovered widespread corruption and bribery within the local police department, prompting calls for systemic reforms and accountability measures.
###

Category: Investigative Journalism

------------

News: ###
{news}
###

Category: `;

export function categoriseNewsPrompt(news: string) {
	return NEWS_CATEGORY_PROMPT.replace(`{news}`, news);
}
