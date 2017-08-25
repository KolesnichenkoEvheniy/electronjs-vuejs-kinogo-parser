export function notify(title = "Готово", text = "") {
	new Notification(title, {
	    body: text
	});
}