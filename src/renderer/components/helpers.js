export function notify(object, text = "", type = 'success') {
	object.$message({
		showClose: true,
		message: text,
		type: type
	});
}